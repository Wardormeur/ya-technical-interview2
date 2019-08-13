<template>
  <div class="login">
    <form @submit.prevent="login">
      <h2 class="login__title">Login</h2>
      <input type="email" name="email" v-validate="'required|email'" v-model="email" placeholder="Email" class="login__email"/>
      <span class="login__email-error">{{ errors.first('email') }}</span>
      <input type="password" name="password" v-validate="'required'" v-model="password" placeholder="Password" class="login__password"/>
      <span class="login__password-error">{{ errors.first('password') }}</span>
      <button type="submit" class="login__submit">Sign up</button>
    </form>
    <router-link to="register" class="login__create-account">No account yet? Create one !</router-link>
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
    };
  },
  methods: {
    login: async function () {
      const valid = await this.$validator.validateAll();
      if (valid) {
        const { id: userId, token } = (await User.login(this.email, this.password)).body;
        sessionStorage.setItem('token', token);
        this.$router.push({ name: 'editProfile', params: { userId } });
      }
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../scss/box';
@import '../scss/input';
.login {
  @include box;
}
.login__title {
  @include box-title;
}
.login__email, .login__password {
  @include input;
  margin-bottom: 0.5rem;
}
.login__submit {
  @include box-submit;
}
.login__create-account {
  @include box-link;
}
.login__email-error, .login__password-error {
  @include input-error;
}
</style>
