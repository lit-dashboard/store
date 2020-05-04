// functions to test:
// 1. getRawSources
// 2. getRawSource,
// 3. getSources
// 4. getSource
// 5. subscribe
// 6. subscribeAll
// 7. clearSources
// 8. removeSources
// 9. sourcesRemoved
// 10. sourcesChanged


describe('sources.js', () => {

  let Sources;

  function addSources(provider = 'Provider') {
    Sources.sourcesChanged(provider, {
      ' ??/ .A': 1,
      '/a': 2,
      '/a/ b /c': true,
      '/ a /b/ c': false,
      '/a/c': { 'd': 'e' },
      'foo/bar': { 'bar': 'foo' },
      '//': [1, 2]
    });
  }

  function addMoreSources(provider = 'Provider') {
    Sources.sourcesChanged(provider, {
      '/a': 5,
      '/ a / b / c': true,
      '/a/b/d': false,
    });
  }

  beforeEach(() => {
    jest.resetModules();
    Sources = require('./sources');
  });

  describe('getRawSources', () => {
    it(`returns undefined if there are no sources matching the provider name passed in`, () => {
      const rawSources = Sources.getRawSources('Provider');
      expect(rawSources).toBe(undefined);
    });
    
    it(`returns raw sources for the passed in provider if sources for it exist`, () => {
      addSources();
      expect(Sources.getRawSources('Provider')).toMatchSnapshot();
      addMoreSources();
      expect(Sources.getRawSources('Provider')).toMatchSnapshot();
    });
  });

  describe('getRawSource', () => {
    it(`returns undefined if there are no sources matching the provider name passed in`, () => {
      const rawSource = Sources.getRawSource('Provider', '/a');
      expect(rawSource).toBe(undefined);
    });

    it(`gets the root source if no string is passed in`, () => {
      addSources();
      expect(Sources.getRawSource('Provider')).toEqual(Sources.getRawSources('Provider'));
    });

    it(`fails to get the source for a key that doesn't exist`, () => {
      addSources();
      let rawSource = Sources.getRawSource('Provider', '/a/b/e');
      expect(rawSource).toBe(undefined);
      rawSource = Sources.getRawSource('Provider', '/a/c/b/e');
      expect(rawSource).toBe(undefined);
    });

    it(`gets the raw source`, () => {
      addSources();
      
      let rawSource = Sources.getRawSource('Provider', '/a');
      expect(rawSource.__key__).toBe(' ??/ .A');
      expect(rawSource.__value__).toBe(2);
      
      rawSource = Sources.getRawSource('Provider', ' !!./ a');
      expect(rawSource.__key__).toBe(' ??/ .A');
      expect(rawSource.__value__).toBe(2);
      
      rawSource = Sources.getRawSource('Provider', '/a/ b!/c');
      expect(rawSource.__normalizedKey__).toBe('/a/b/c');
      expect(rawSource.__key__).toBe('/a/ b /c');
      expect(rawSource.__value__).toBe(false);
      
      rawSource = Sources.getRawSource('Provider', '/a /b');
      expect(rawSource.__normalizedKey__).toBe('/a/b');
      expect(rawSource.__key__).toBe('/a/ b ');
      expect(rawSource.__value__).toBe(undefined);
      expect(rawSource.__fromProvider__).toBe(false);
      
      Sources.sourcesChanged('Provider', {
        '/a/b?': 10
      });

      rawSource = Sources.getRawSource('Provider', '/a/b');
      expect(rawSource.__normalizedKey__).toBe('/a/b');
      expect(rawSource.__key__).toBe('/a/ b ');
      expect(rawSource.__value__).toBe(10);
      expect(rawSource.__fromProvider__).toBe(true);

      addMoreSources();
      
      rawSource = Sources.getRawSource('Provider', '/a/b/c');
      expect(rawSource.__value__).toBe(true);
    });
  });

  describe('getSources', () => {
    it(`returns undefined if there are no sources matching the provider name passed in`, () => {
      const sources = Sources.getSources('Provider');
      expect(sources).toBe(undefined);
    });

    it(`returns sources`, () => {
      addSources();
      const sources = Sources.getSources('Provider');
      expect(sources['/a'].constructor.name).toBe('Source');

      expect(sources['/a'].b.c).toBe(false);
      expect(sources[' / a']).toBe(undefined);
      expect(sources['/a/b/c']).toBe(false);

      addMoreSources();
      expect(sources['/a'].constructor.name).toBe('Source');
      expect(sources['/a'].b.c).toBe(true);
      expect(sources['/a/b/c']).toBe(true);
    });
  });

  describe('getSource', () => {
    it(`returns undefined if there are no providers matching the one passed in`, () => {
      const source = Sources.getSource('Provider', '/a');
      expect(source).toBe(undefined);
    });

    it(`returns undefined if there are no sources in the provider passed in`, () => {
      addSources();
      expect(Sources.getSource('Provider', '/asdfsdfsfd')).toBe(undefined);
      expect(Sources.getSource('Provider', '/a/b/c/d')).toBe(undefined);
    });

    it(`returns a source`, () => {
      addSources();
      expect(Sources.getSource('Provider', '/a').constructor.name).toBe('Source');
      expect(Sources.getSource('Provider', '/a').b.constructor.name).toBe('Source');
      expect(Sources.getSource('Provider', '/a').b.c).toBe(false);
      expect(Sources.getSource('Provider', '/?a / c!')).toEqual({ 'd': 'e' });
      expect(Sources.getSource('Provider', '/? a'))
        .toEqual(Sources.getSource('Provider', '/a'));
    });
  });

  describe('subscribe', () => {
    it(`throws an error if the callback passed in is not a function`, () => {
      expect(() => {
        Sources.subscribe('Provider', '/a');
      }).toThrow('Callback is not a function');
    });

    it(`doesn't call back immediately when there is no source`, () => {
      const mockCallback = jest.fn();
      Sources.subscribe('Provider', '/a', mockCallback, true);
      expect(mockCallback).toHaveBeenCalledTimes(0);
    });

    it(`calls back immediately`, () => {
      const mockCallback = jest.fn();
      addSources();
      Sources.subscribe('Provider', '/a', mockCallback, true);
      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenNthCalledWith(
        1, Sources.getSource('Provider', '/a'), '/a', '/a'
      );
    });

    it(`doesn't call back immediately`, () => {
      const mockCallback = jest.fn();
      addSources();
      Sources.subscribe('Provider', '/a', mockCallback);
      expect(mockCallback).toHaveBeenCalledTimes(0);
    });

    it(`subscribes to changes`, () => {
      const mockCallback1 = jest.fn();
      const mockCallback2 = jest.fn();

      Sources.sourcesChanged('Provider', { '/a/ b /c': true });

      Sources.subscribe('Provider', '/a/b/c', mockCallback1, true);
      Sources.subscribe('Provider', '/a? / B/ C. ', mockCallback2);

      addSources();

      expect(mockCallback1).toHaveBeenCalledTimes(3);
      expect(mockCallback1).toHaveBeenNthCalledWith(
        1, true, '/a/b/c', '/a/b/c'
      );
      expect(mockCallback1).toHaveBeenNthCalledWith(
        2, true, '/a/b/c', '/a/b/c'
      );
      expect(mockCallback1).toHaveBeenNthCalledWith(
        3, false, '/a/b/c', '/a/b/c'
      );

      expect(mockCallback2).toHaveBeenCalledTimes(2);
      expect(mockCallback2).toHaveBeenNthCalledWith(
        1, true, '/a/b/c', '/a/b/c'
      );
      expect(mockCallback2).toHaveBeenNthCalledWith(
        2, false, '/a/b/c', '/a/b/c'
      );
    });

    it(`subscribes to changes and changes to its child sources`, () => {
      const mockCallback = jest.fn();
      const mockCallback2 = jest.fn();
      Sources.subscribe('Provider', '/a', mockCallback);
      Sources.subscribe('Provider', '/a/b', mockCallback2);
      addSources();

      expect(mockCallback).toHaveBeenCalledTimes(5);
      expect(mockCallback).toHaveBeenNthCalledWith(
        1, 1, '/a', '/a'
      );
      expect(mockCallback).toHaveBeenNthCalledWith(
        2, 2, '/a', '/a'
      );
      expect(mockCallback).toHaveBeenNthCalledWith(
        3, expect.any(Object), '/a', '/a/b/c'
      );
      expect(mockCallback).toHaveBeenNthCalledWith(
        4, expect.any(Object), '/a', '/a/b/c'
      );
      expect(mockCallback).toHaveBeenNthCalledWith(
        5, expect.any(Object), '/a', '/a/c'
      );

      expect(mockCallback2).toHaveBeenCalledTimes(2);
      expect(mockCallback2).toHaveBeenNthCalledWith(
        1, expect.any(Object), '/a/b', '/a/b/c'
      );
      expect(mockCallback2).toHaveBeenNthCalledWith(
        1, expect.any(Object), '/a/b', '/a/b/c'
      );
    });

    it('subscribes to changes when a source is removed', () => {
      addSources();
      const mockCallback = jest.fn();
      const mockCallback2 = jest.fn();
      const mockCallback3 = jest.fn();

      Sources.subscribe('Provider', '/a/b/c', mockCallback);
      Sources.subscribe('Provider', '/a/ b?', mockCallback2);
      Sources.subscribe('Provider', '/a', mockCallback3);

      Sources.sourcesRemoved('Provider', ['/a/b/c']);
      Sources.sourcesRemoved('Provider', ['/a/c']);

      expect(mockCallback).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenNthCalledWith(
        1, undefined, '/a/b/c', '/a/b/c'
      );

      expect(mockCallback2).toHaveBeenCalledTimes(1);
      expect(mockCallback2).toHaveBeenNthCalledWith(
        1, undefined, '/a/b', '/a/b'
      );

      expect(mockCallback3).toHaveBeenCalledTimes(0);
      Sources.sourcesRemoved('Provider', ['/a']);
      expect(mockCallback3).toHaveBeenCalledTimes(1);
      expect(mockCallback3).toHaveBeenNthCalledWith(
        1, undefined, '/a', '/a'
      );
    });
  });
});
