import { mount, createLocalVue } from '@vue/test-utils';
import VueRouter from 'vue-router';
import VeeValidate from 'vee-validate';
import User from '@/api/User';
import Profile from '@/components/Profile.vue';

const localVue = createLocalVue();
localVue.use(VueRouter);
localVue.use(VeeValidate);
const router = new VueRouter({ routes: [{ path: '/profile/:id', name: 'viewProfile' }] });
const mockData = { firstName: 'John', lastName: 'Doe', position: 'Barber', about: 'Excentric magician', topics: ['Topic 1', 'Topic 2'] };

describe('ViewProfile.vue', () => {
  let mockPromiseUpdate;
  let mockPromiseRead;
  let wrapper;
  beforeAll(() => {
    User.update = jest.fn(() => mockPromiseUpdate);
    User.read = jest.fn(() => mockPromiseRead);
    mockPromiseUpdate = Promise.resolve({ body: mockData })
    mockPromiseRead = Promise.resolve({ body: mockData });
    sessionStorage.getItem.mockReturnValue('{ "id": 1 }');
  });
  beforeEach(async () => {
    wrapper = mount(Profile, { localVue, router, attachToDocument: true, sync: false });
  });
  it('should set its data from the API into the model', () => {
    expect(wrapper.vm).toMatchObject({ ...mockData, topics: ['Topic 0', 'Topic 1', 'Topic 2', 'Topic 3', 'Topic 4', 'Topic 5'] });
  });
  it('should display the information from the model', () => {
    expect(wrapper.find('.profile__names-first').element.value).toMatch('John');
    expect(wrapper.find('.profile__names-last').element.value).toMatch('Doe');
    expect(wrapper.find('.profile__position').element.value).toMatch(mockData.position);
    expect(wrapper.find('.profile__about').element.value).toMatch(mockData.about);
  });
  it('should remove the topic to the selected list', () => {
    wrapper.vm.selectTopic({ target: { checked: false, value: 'Topic 2' } });
    expect(wrapper.vm.selectedTopics).toEqual(['Topic 1']);
  });
  it('should add the topic to the selected list', () => {
    wrapper.vm.selectTopic({ target: { checked: true, value: 'Transmetropolitan' } });
    expect(wrapper.vm.selectedTopics).toEqual(mockData.topics.concat(['Transmetropolitan']));
  });
  it('should save the info with the correct user', async () => {
    wrapper.vm.$router.push = jest.fn();
    await wrapper.vm.save();
    expect(User.update).toBeCalledWith(1, mockData);
    expect(sessionStorage.setItem).toBeCalledWith('currentUser', JSON.stringify({ id: 1, ...mockData }));
    expect(wrapper.vm.$router.push).toBeCalledWith({ name: 'viewProfile', params: { userId: 1 }});
  });
})
