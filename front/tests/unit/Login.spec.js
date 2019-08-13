import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import VeeValidate from 'vee-validate';
import User from '@/api/User';
import Profile from '@/components/Login.vue';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(VeeValidate);
const router = new VueRouter({
  routes: [{ path: '/', name: 'register' }],
});
const mockData = { email: 'banana@master.com', password: 'Banana4DonkeyKong' };

describe('Login.vue', () => {
  let mockPromise;
  let wrapper;
  beforeAll(() => {
    User.login = jest.fn(() => mockPromise);
  });
  beforeEach(async () => {
    wrapper = mount(Profile, { localVue, router, sync: false });
    wrapper.setData(mockData);
  });
  it('should display the information from the model', () => {
    expect(wrapper.find('.login__email').element.value).toMatch('banana@master.com');
    expect(wrapper.find('.login__password').element.value).toMatch('Banana4DonkeyKong');
  });
  it('should create a new user', async () => {
    const pushSpy = jest.fn();
    wrapper.vm.$router.push = pushSpy;
    mockPromise = Promise.resolve({ body: { id: 1, token: 'abc' } });
    await wrapper.vm.login();
    expect(User.login).toBeCalledWith(mockData.email, mockData.password);
    expect(sessionStorage.setItem).toBeCalledWith('token', 'abc');
    expect(pushSpy).toBeCalledWith({ name: 'editProfile', params: { userId: 1 }});
  });
})
