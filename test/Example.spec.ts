import Example from '../src/lib/Example';
import IExample from '../src/lib/IExample';
import {mockExample} from './ExampleMock';
import {expect} from 'chai';

let example:IExample;

describe('Example', () => {
  beforeEach(() => {
    example = new Example();
  });

  it('should return the correct environment', () => {
    expect(example.foo(mockExample)).to.equal('foobar');
  });

  it('should return the default environment when none has been supplied', () => {
    expect(example.foo()).to.equal('baz');
  });
});
