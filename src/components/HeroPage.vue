<template>
  <v-container class="fill-height hero-background py-0 pl-14 pr-0 mt-n16 h-auto" fluid>
    <div class="d-lg-block">
        <h1 class="text-h4 font-weight-bold">Track. Change. Grow.</h1>
        <h1 class="text-h1 font-weight-bold">Habit Tracker</h1>
        <div class="text-body-2 font-weight-light mb-5 link pr-0" @click="scrolldown">Learn more</div>
        <v-row class="d-flex align-center justify-center">
            <v-col cols="auto">
              <v-btn
                min-width="164"
                variant="text"
                @click="openDialog('login')"
              >
                <v-icon
                  icon="mdi-login"
                  size="large"
                  start
                />

                Login
              </v-btn>
              <FormDialog 
              title="Login"
              :fields = "LoginFields"
              :visible="LoginDialog"
              :error = "error"
              @close="closeDialog"
              @submit="submitDialog"
              />
            </v-col>

            <v-col cols="auto">
              <v-btn
                min-width="164"
                variant="text"
                @click="openDialog('signUp')"
              >
                <v-icon
                  icon="mdi-account-circle"
                  size="large"
                  start
                />

                Sign Up
              <FormDialog 
              title="Sign Up (keep in mind there is no encryption .. yet)"
              :fields = "SignUpFields"
              :visible="SignUpDialog"
              :error="error"
              @close="closeDialog"
              @submit="submitDialog"
              />
            </v-btn>
            </v-col>
        </v-row>
    </div>
    <v-img 
        src="/climber.jpg" 
        alt="image of sun set" 
        class="ml-16 float-right" 
        max-width="1140px"
        cover
    />
  </v-container>
<LearnMore /> 
</template>

<style>
    .hero-background{
        background-color: whitesmoke;
    }
    .link:hover{
        color: blue;
        text-decoration: underline;
        cursor: pointer;
    }
</style>

<script lang="ts">
    export default {
        data(){
            return{
                LoginDialog: false,
                SignUpDialog: false,
                error: "",
                LoginFields: [
                    {
                        id: "userName",
                        title: "Username",
                        type: "text",
                        required: true,
                        hint: "enter your username here"
                    },
                    {
                        id: "password",
                        title: "Password",
                        type: "password",
                        required: true,
                        hint: "enter your password here"
                    }
                ],
                SignUpFields: [
                    {
                        id:"firstName",
                        title: "First name",
                        type: "text",
                        required: true,
                    },
                    {
                        id:"lastName",
                        title: "Last name",
                        type: "text",
                        required: true,
                    },
                    {
                        id:"userName",
                        title: "Username",
                        type: "text",
                        required: true,
                    },
                    {
                        id:"password",
                        title: "Password",
                        type: "password",
                        required: true,
                    },
                ],
            };
        },
        methods: {
            openDialog(dialog: string){
                if (dialog === "signUp"){
                    this.SignUpDialog = true;
                }
                else if (dialog === "login"){
                    this.LoginDialog = true;
                }
            },
            closeDialog(){
                this.SignUpDialog = false;
                this.LoginDialog = false;
                this.error = "";
            },
            submitDialog(inputs){
                // check to see what the dialog is then do logic with inputs when server is running
                if( this.LoginDialog){
                    this.login(inputs);
                }else if( this.SignUpDialog){
                    this.signUp(inputs);
                }
            },
            login: async function (data){
                console.log(data);
                let res = await fetch( `${this.$URL}/sessions`, {
                    method: "POST",
                    body: JSON.stringify(data),
                    headers: {
                        "Content-Type" : "application/json",
                    },
                });
                if (res.status == 200){
                    let info = await res.json();
                    localStorage.setItem("userId", info.UserId);
                    this.$router.push('/home');
                    this.closeDialog();
                }else if (res.status == 401){
                    this.error = "Invalid Username or Password";
                }

            },
            signUp: async function (data){
                let res = await fetch( `${this.$URL}/users/check-username?username=${data.userName}`);
                if (res.status == 409){
                    this.error = "Username is taken, please pick a different one";
                    return;
                }else if (res.status == 200){
                    let res2 = await fetch( `${this.$URL}/users`, {
                        method: "POST",
                        body: JSON.stringify(data),
                        headers: {
                            "Content-Type" : "application/json",
                        },
                    });
                    if (res2.status == 201){
                        let newData = {};
                        newData['userName'] = data.userName;
                        newData['password'] = data.password;
                        let res3 = await fetch(`${this.$URL}/sessions`,{
                            method: "POST",
                            body: JSON.stringify(newData),
                            headers: {
                                "Content-Type" : "application/json",
                            },
                        });
                        if (res3.status == 200){
                            let info = await res3.json();
                            console.log(info);
                            localStorage.setItem("userId", info.UserId);
                            this.$router.push('/home');
                            this.closeDialog();
                        }
                    }
                }
                    
            },
            scrolldown(){
                window.scrollTo({
                top: document.body.scrollHeight,
                behavior: 'smooth'
              });
            },
        }
    };
  //
</script>

