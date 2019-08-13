<template>
  <div class="register">
    <form @submit.prevent="register">
      <h2 class="register__title">Register</h2>
      <input type="email" name="email" placeholder="Email" v-model="email" v-validate="'required|email'" class="register__email"/>
      <span class="register__email-error">{{ errors.first('email') }}</span>
      <input type="password" name="password" ref="password" placeholder="Password" v-model="password" v-validate="'required'" class="register__password"/>
      <input type="password" name="password_confirmation" placeholder="Password Confirmation" v-validate="'required|confirmed:password'" v-model="passwordConfirmation" class="register__password-confirmation"/>
      <span class="register__password-error">{{ errors.first('password_confirmation') }}</span>
      <button type="submit" class="register__submit">Sign up</button>
    </form>
    <router-link :to="{ name: 'home' }" class="register__login-link">&lsaquo; Back to login</router-link>
  </div>
</template>

<script>
import User from '@/api/User';

export default {
  name: 'Login',
  data: () => {
    return {
      email: '',
      password: '',
      passwordConfirmation: '',
    };
  },
  methods: {
    register: async function () {
      const valid = await this.$validator.validateAll();
      if (valid) {
        const { id: userId } = (await User.create({ email: this.email, password: this.password })).body;
        const { token } = (await User.login(this.email, this.password)).body;
        sessionStorage.setItem('token', token);
        this.$router.push({ name: 'editProfile', params: { userId } });
      }
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../scss/box';
@import '../scss/input';
.register {
  @include box;
}
.register__title {
  @include box-title;
}
.register__email, .register__password, .register__password-confirmation {
  @include input;
  margin-bottom: 0.5rem;
}
.register__submit {
  @include box-submit;
}
.register__login-link {
  @include box-link;
}
.register__password-error, .register__email-error {
  @include input-error;
}
</style>
