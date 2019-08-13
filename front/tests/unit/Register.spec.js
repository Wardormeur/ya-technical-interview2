import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import VeeValidate from 'vee-validate';
import User from '@/api/User';
import Profile from '@/components/Register.vue';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(VeeValidate);
const router = new VueRouter({
  routes: [{ path: '/', name: 'home' }],
});
const mockData = { email: 'banana@master.com', password: 'Banana4DonkeyKong' };

describe('Register.vue', () => {
  let mockPromiseCreate;
  let mockPromiseLogin;
  let wrapper;
  beforeAll(() => {
    User.create = jest.fn(() => mockPromiseCreate);
    User.login = jest.fn(() => mockPromiseLogin);
  });
  beforeEach(async () => {
    wrapper = mount(Profile, { localVue, router, sync: false });
    wrapper.setData({ ...mockData, passwordConfirmation: 'Banana4DonkeyKong' });
  });
  it('should display the information from the model', () => {
    expect(wrapper.find('.register__email').element.value).toMatch('banana@master.com');
    expect(wrapper.find('.register__password').element.value).toMatch('Banana4DonkeyKong');
    expect(wrapper.find('.register__password-confirmation').element.value).toMatch('Banana4DonkeyKong');
  });
  it('should create a new user', async () => {
    wrapper.vm.$router.push = jest.fn();
    mockPromiseCreate = Promise.resolve({ body: { id: 1 } });
    mockPromiseLogin = Promise.resolve({ body: { id: 1, token: 'abc' } });
    await wrapper.vm.register();
    expect(User.create).toBeCalledWith(mockData);
    expect(User.login).toBeCalledWith(...Object.values(mockData));
    expect(sessionStorage.setItem).toBeCalledWith('token', 'abc');
    expect(wrapper.vm.$router.push).toBeCalledWith({ name: 'editProfile', params: { userId: 1 } });
  });
})
