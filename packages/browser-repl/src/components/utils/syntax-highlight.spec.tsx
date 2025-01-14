import React from 'react';
import { CodemirrorInlineEditor } from '@mongodb-js/compass-editor';
import { expect } from '../../../testing/chai';
import { mount } from '../../../testing/enzyme';
import { SyntaxHighlight } from './syntax-highlight';

describe('<SyntaxHighlight />', () => {
  let wrapper;

  afterEach(() => {
    wrapper.unmount();
    wrapper = null;
  });

  it('renders Code', () => {
    wrapper = mount(<SyntaxHighlight code={'some code'} />);
    expect(wrapper.find(CodemirrorInlineEditor)).to.have.lengthOf(1);
  });

  it('passes code to Code', () => {
    wrapper = mount(<SyntaxHighlight code={'some code'} />);
    expect(wrapper.find(CodemirrorInlineEditor).prop('initialText')).to.equal(
      'some code'
    );
  });
});
