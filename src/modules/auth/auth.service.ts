interface RegisterValues {
  email: string;
  username: string;
  password: string;
}

class AuthService<U> {
  constructor(public userService: UserService) {}

  async register(values: RegisterValues): Promise<U> {
    return await this.userService;
  }
}
