<template>
    <v-dialog 
    :modelValue="visible" 
    @update:modelValue="visible == $event" 
    max-width="800px"
    persistent
    >
        <v-card>
            <v-card-title> {{ title }} </v-card-title>
            <v-form @submit.prevent="submitDialog" ref="form">
                <div v-for="field in fields" :key="field.id">

                    <v-card-text v-if="(field.type === 'text' || field.type === 'password' || field.type === 'number') && !field.required">
                        <v-text-field  :hint="field.hint" :type="field.type" v-model="fieldValues[field.id]" @input="handleChange(field.id, $event.target.value)"
                        :label="field.title"
                        ></v-text-field>
                    </v-card-text>

                    <v-card-text v-if="(field.type === 'text' || field.type === 'password' || field.type === 'number') && field.required">
                        <v-text-field :hint="field.hint" :rules="[rules.required]" :type="field.type" v-model="fieldValues[field.id]" @input="handleChange(field.id, $event.target.value)"
                        :label="field.title"
                        ></v-text-field>
                    </v-card-text>

                    <div v-if="(field.type == 'bool')" class="flex">
                        <v-switch  color= "primary" :label = "field.title"
                        class="float-right mr-5" v-model="fieldValues[field.id]"
                        ></v-switch>
                    </div>
                </div>
                <br/>
                <br/>
                <v-card-actions>
                    <v-btn @click="closeDialog">Close</v-btn>
                    <v-btn color="primary" @click="submitDialog" >Submit</v-btn>
                    <span class="text-red ml-5"> {{ error }} </span>
                </v-card-actions>
            </v-form>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
export default {
    props: {
        title: string,
        fields:{
            type: Array as () => Field[],
            default: null
        },
        visible: Boolean,
        error: string,
    },
    data(){
        return{
            rules: {
                required: value => !!value || 'Field is required',
            },
            fieldValues: {} as Record<string,string>
        };
    },
    mounted: function(){
        this.setUp();
        },
    watch: {
        fields: {
          immediate: true,
          handler(newFields) {
            if (newFields.length > 0) {
                this.setUp();
            }
          }
        }
    },
    methods: {
        setUp(){
            this.fields.forEach((field)=>{
                if (field.type == 'bool' && field.value != null){
                    this.fieldValues[field.id] = field.value;
                }else if (field.type == 'text' && field.value != null){
                    this.fieldValues[field.id] = field.value;
                }else{
                    this.fieldValues[field.id] = "";
                }
            });
        },
        handleChange(id: string, value: string){
            this.fieldValues[id] = value;
            this.$emit('inputChange',id, value);
        },
        closeDialog(){
            this.setUp();
            this.$emit('close');
        },
        submitDialog(){
            this.$refs.form.validate().then(valid=>{
                if(!valid.valid){
                    return;
                }
                else{
                    let valuesClone = JSON.parse(JSON.stringify(this.fieldValues));
                    this.$emit('submit', valuesClone);
                    setTimeout(() => {
                        if (!this.error || this.error.length == 0){
                            this.setUp();
                        }
                    }, 1000);
                }
            });
        }
    },
};
    interface Field{
        id: string,
        title: string,
        type: string,
        required: Boolean,
        value?: any,
        options?: string[],
        hint?: string,
    }
    /* interface Form{ */
    /*     title: string, */
    /*     fields?: Field[], */
    /*     body?: String, */
    /*     submit?: String, */
    /*     close?: String, */
    /* } */
</script>
