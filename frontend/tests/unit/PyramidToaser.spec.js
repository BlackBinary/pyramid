import { expect } from 'chai';
import { shallowMount } from '@vue/test-utils';
import PyramidToaster from '@frontend/components/alerts/PyramidToaster.vue';

describe('PyramidToaster.vue', () => {
  it('renders props.value when passed', () => {
    const value = {
      message: '',
      type: '',
    };
    const wrapper = shallowMount(PyramidToaster, {
      propsData: { value },
    });
    expect(wrapper.text()).to.include(value);
  });
});
