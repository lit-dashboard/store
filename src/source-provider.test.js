import SourceProvider from './source-provider';
import * as mockSources from './store/sources';


jest.mock('./store/sources', () => ({
  subscribe: jest.fn(),
  subscribeAll: jest.fn(),
  getRawSource: jest.fn(),
  getSource: jest.fn(),
  getSources: jest.fn(),
  clearSources: jest.fn(),
  sourcesChanged: jest.fn(),
  sourcesRemoved: jest.fn()
}));

class FailProvider extends SourceProvider {
  constructor() {
    super();
  }
}

class TestProvider extends SourceProvider {

  constructor() {
    super('TestProvider');
  }

  userUpdate(key, value) {
    this.updateSource(key, value);
  }
}

function triggerUpdate() {
  jest.advanceTimersByTime(100);
}

describe('source-provider.js', () => {
  describe('SourceProvider', () => {
    it('Fails to create a direct instance of SourceProvider', () => {
      expect(() => {
        new SourceProvider('Provider');
      }).toThrow('Cannot construct SourceProvider instances directly');
    });

    it(`Fails to create a SourceProvider that doesn't pass a providerName into the super constructor`, () => {
      expect(() => {
        new FailProvider();
      }).toThrow(`The providerName needs to be passed into super() from your provider's constructor.`);
    });

    let testProvider;

    beforeEach(() => {
      jest.useFakeTimers();
      testProvider = new TestProvider();
    });

    it(`does not call sourcesChanged if sources haven't been updated`, () => {
      triggerUpdate();
      expect(mockSources.sourcesChanged).toHaveBeenCalledTimes(0);
    });

    it(`calls sourcesChanged if sources have been updated and after waiting a period of time`, () => {
      testProvider.updateSource('/a', 3);
      expect(mockSources.sourcesChanged).toHaveBeenCalledTimes(0);
      triggerUpdate();
      expect(mockSources.sourcesChanged).toHaveBeenCalledTimes(1);
    });

    it(`does not continue calling sourcesChanged after changes have been sent`, () => {
      testProvider.updateSource('/a', 3);
      triggerUpdate();
      expect(mockSources.sourcesChanged).toHaveBeenCalledTimes(1);
      triggerUpdate();
      expect(mockSources.sourcesChanged).toHaveBeenCalledTimes(1);
    });

    it(`calls sourcesChanged multiple times after multiple updates`, () => {
      testProvider.updateSource('/a', 3);
      triggerUpdate();
      expect(mockSources.sourcesChanged).toHaveBeenCalledTimes(1);
      testProvider.updateSource('/a', 3);
      triggerUpdate();
      expect(mockSources.sourcesChanged).toHaveBeenCalledTimes(2);
    });

    it('calls sourcesChanged with each updated source', () => {
      testProvider.updateSource('/a', 3);
      testProvider.updateSource('/b', true);
      triggerUpdate();
      expect(mockSources.sourcesChanged).toHaveBeenCalledTimes(1);
      expect(mockSources.sourcesChanged).toHaveBeenNthCalledWith(1, 'TestProvider', {
        '/a': 3,
        '/b': true
      });
    });

    it(`calls sourcesChanged with first and most recent updates`, () => {
      testProvider.updateSource('/a', 3);
      testProvider.updateSource('/a', 5);
      testProvider.updateSource('/a', 10);
      testProvider.updateSource('/a/b', 'c');
      triggerUpdate();
      expect(mockSources.sourcesChanged).toHaveBeenCalledTimes(2);
      expect(mockSources.sourcesChanged).toHaveBeenNthCalledWith(1, 'TestProvider', {
        '/a': 3,
        '/a/b': 'c'
      });
      expect(mockSources.sourcesChanged).toHaveBeenNthCalledWith(2, 'TestProvider', {
        '/a': 10
      });
    });

    it(`does not call sourcesRemoved if sources haven't been removed`, () => {
      triggerUpdate();
      expect(mockSources.sourcesRemoved).toHaveBeenCalledTimes(0);
    });

    it(`calls sourcesRemoved if sources have been removed and after waiting a period of time`, () => {
      testProvider.removeSource('/a');
      expect(mockSources.sourcesRemoved).toHaveBeenCalledTimes(0);
      triggerUpdate();
      expect(mockSources.sourcesRemoved).toHaveBeenCalledTimes(1);
    });

    it(`does not continue calling sourcesRemoved after removals have been sent`, () => {
      testProvider.removeSource('/a');
      triggerUpdate();
      expect(mockSources.sourcesRemoved).toHaveBeenCalledTimes(1);
      triggerUpdate();
      expect(mockSources.sourcesRemoved).toHaveBeenCalledTimes(1);
    });

    it(`calls sourcesRemoved multiple times after multiple removals`, () => {
      testProvider.removeSource('/a');
      triggerUpdate();
      expect(mockSources.sourcesRemoved).toHaveBeenCalledTimes(1);
      testProvider.removeSource('/a');
      triggerUpdate();
      expect(mockSources.sourcesRemoved).toHaveBeenCalledTimes(2);
    });

    it('calls sourcesRemoved with each removed source', () => {
      testProvider.removeSource('/a');
      testProvider.removeSource('/b');
      triggerUpdate();
      expect(mockSources.sourcesRemoved).toHaveBeenCalledTimes(1);
      expect(mockSources.sourcesRemoved).toHaveBeenNthCalledWith(1, 'TestProvider', [
        '/a', '/b' 
      ]);
    });

    it(`calls sourcesChanged and sourcesRemoved in order of when they were triggered`, () => {
      
      let mockUpdates = {
        '/a': [],
        '/b': [],
        '/c': [],
        '/d': [],
        '/e': [],
        '/f': [],
        '/g': [],
        '/h': []
      };

      mockSources.sourcesChanged.mockImplementation((_, changes) => {
        for (let key in changes) {
          mockUpdates[key].push('change');
        }
      });

      mockSources.sourcesRemoved.mockImplementation((_, removals) => {
        removals.forEach(removal => {
          mockUpdates[removal].push('removal');
        });
      });

      testProvider.updateSource('/a', 1);
      testProvider.updateSource('/a', 2);
      testProvider.updateSource('/a', 3);

      testProvider.updateSource('/b', 1);
      testProvider.updateSource('/b', 2);
      testProvider.removeSource('/b');

      testProvider.updateSource('/c', 1);
      testProvider.removeSource('/c');
      testProvider.updateSource('/c', 2);

      testProvider.updateSource('/d', 1);
      testProvider.removeSource('/d');
      testProvider.removeSource('/d');

      testProvider.removeSource('/e');
      testProvider.updateSource('/e', 2);
      testProvider.updateSource('/e', 3);

      testProvider.removeSource('/f');
      testProvider.updateSource('/f', 2);
      testProvider.removeSource('/f');

      testProvider.removeSource('/g');
      testProvider.removeSource('/g');
      testProvider.updateSource('/g', 2);

      testProvider.removeSource('/h');
      testProvider.removeSource('/h');
      testProvider.removeSource('/h');

      triggerUpdate();

      expect(mockUpdates).toEqual({
        '/a': ['change', 'change'],
        '/b': ['change', 'removal'],
        '/c': ['change', 'change'],
        '/d': ['change', 'removal'],
        '/e': ['removal', 'change'],
        '/f': ['removal', 'removal'],
        '/g': ['removal', 'change'],
        '/h': ['removal', 'removal']
      });
    });

    it(`clears sources when clearSources is called`, () => {
      testProvider.clearSources();
      expect(mockSources.clearSources).toHaveBeenCalledTimes(1);
      expect(mockSources.clearSources).toHaveBeenNthCalledWith(1, 'TestProvider');
    });

    it(`makes updates immediately when clearSources is called`, () => {
      testProvider.updateSource('/a', 1);
      testProvider.clearSources();
      expect(mockSources.sourcesChanged).toHaveBeenCalledTimes(1);
      expect(mockSources.sourcesChanged).toHaveBeenNthCalledWith(1, 'TestProvider', {
        '/a': 1
      });
      testProvider.updateSource('/a', 2);
      triggerUpdate();
      expect(mockSources.sourcesChanged).toHaveBeenCalledTimes(2);
      expect(mockSources.sourcesChanged).toHaveBeenNthCalledWith(2, 'TestProvider', {
        '/a': 2
      });
      testProvider.updateSource('/a', 1);
      testProvider.updateSource('/a', 2);
      testProvider.clearSources(() => {
        expect(mockSources.sourcesChanged).toHaveBeenCalledTimes(4);
        triggerUpdate();
        expect(mockSources.sourcesChanged).toHaveBeenCalledTimes(4);
      });
    });
  });
});