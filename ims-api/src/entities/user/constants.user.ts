export enum UserStatus {
    VERIFIED = 1,
    PENDING = 0,
  }
  
  export enum UserRole {
    ADMIN = 1,
    USER = 0,
    CUSTOMER = 2 //TODO: 1. create customer table, customer routes, customer dashboard/pages
  
  }
  
  export enum UserPassword {
    default = "Password123",
  }

  export enum UserMessages {
    enter_username = "please enter username",
    enter_password = "please enter password",
    enter_email = "please enter email",
    password_strength = "Password must contain uppercase and lowercase characters, minimum character length 8, maximum 20",
    enter_phone_number ="please enter phone number",


  }
  
  
  