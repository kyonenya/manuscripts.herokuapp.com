import assert from 'assert';
import { Either } from '../Either';

describe('Either', () => {
  it('map', () => {
      Either.ofRight(123)
        .map((x: number) => x * 2)
        .map(x => assert.strictEqual(x, 246))
        ;
  });
  it('bind', () => {
    Either.ofRight('valid%3Fid%3D')
      .map((x: string) => x + '123')
      .bind(decode)
      .map(x => assert.strictEqual(x, 'valid?id=123'));
      ;
  });
  it('flatten', () => {
      Either.ofRight(Either.ofRight(123))
        .flatten()
        .map(x => assert.strictEqual(x, 123))
        ;
      Either.ofRight(Either.ofLeft('[Error]'))
        .flatten()
        .mapLeft(x => assert.strictEqual(x, '[Error]'))
        ;
      Either.ofLeft(Either.ofRight(123))
        .flatten()
        .mapLeft(x => assert.ok(x instanceof Either))
        ;
  });
  it('async map', () => {
    Either.ofRight(123)
      .map(lazyDouble)
      .awaitMap(x => assert.strictEqual(x, 246))
      ;
  });
  it('async flatten', () => {
    Either.ofRight('valid%3Fid%3D')
      .map(lazyDecode)
      .awaitMap(x => {
        assert.ok(x instanceof Either);
        return x;
      })
      .awaitFlatten()
      .awaitMap(x => assert.strictEqual(x, { status: 'Right', value: 'valid?id='}))
      ;
  });
});

const lazyDouble = (x: number): Promise<number> => new Promise((resolve, reject) => resolve(x * 2));
const decode = (url: string): Either<string, string> => {
  try {
    return Either.ofRight(decodeURIComponent(url));
  } catch (err) {
    return Either.ofLeft(`${err}`);
  }
};
const lazyDecode = async (url: string): Promise<Either<string, string>> => {
  const promisedDecode = (url: string): Promise<string> => Promise.resolve(decodeURIComponent(url));
  try {
    const result = await promisedDecode(url);
    return Either.ofRight(result);
  } catch (err) {
    return Either.ofLeft(`${err}`);
  }
};
