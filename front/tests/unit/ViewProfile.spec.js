import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import User from '@/api/User';
import ViewProfile from '@/components/ViewProfile.vue';
const localVue = createLocalVue();
localVue.use(VueRouter);
const router = new VueRouter({
  routes: [{ name: 'editProfile', path: '/profile' }],
});
const mockData = { firstName: 'John', lastName: 'Doe', position: 'Barber', about: 'Excentric magician', topics: ['Topic 1', 'Topic 2'] };
describe('ViewProfile.vue', () => {
  let mockPromise;
  let wrapper;
  beforeAll(() => {
    User.read = jest.fn(() => mockPromise);
    mockPromise = Promise.resolve({ body: mockData });
    sessionStorage.getItem.mockReturnValue('{ "id": 1, "topics": [] }');
  });
  beforeEach(async () => {
    wrapper = mount(ViewProfile, { localVue, router });
    wrapper.vm.$route.params.userId = 1 ;
    await wrapper.vm.$nextTick();
  });
  it('should set its data from the API into the model', () => {
    expect(wrapper.vm).toMatchObject(mockData);
  });
  it('should display the information from the model', () => {
    expect(wrapper.find('.vprofile__name').text()).toMatch('John Doe');
    expect(wrapper.find('.vprofile__position').text()).toMatch(mockData.position);
    expect(wrapper.find('.vprofile__about').text()).toMatch(mockData.about);
  });
  it('should return an ordered list of topics', () => {
    const viewedTopics = ['Superman', 'Batman', 'Transmetropolitan', 'Sandman'];
    const viewersTopics = ['Sandman', 'Transmetropolitan', 'Hellblazer'];
    wrapper.setData({ currentUser: { topics: viewersTopics }, topics: viewedTopics });
    expect(wrapper.vm.sortedTopics).toEqual(['Transmetropolitan', 'Sandman', 'Superman', 'Batman']);
  });
  it('should return if the user is the owner of the profile', () => {
    wrapper.setData({ currentUser: { id: 1 } });
    expect(wrapper.vm.isOwn).toBeTruthy;
  });
  it('should return if the user is the owner of the profile', () => {
    wrapper.setData({ currentUser: { id: 2 } });
    expect(wrapper.vm.isOwn).toBeFalsy;
  });
})
