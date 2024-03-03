<template>
    <v-dialog 
    :modelValue="visible" 
    @update:modelValue="visible = $event" 
    max-width="800px"
    >
        <v-card>
            <v-card-title> {{ title }} </v-card-title>
            <div v-for="item in info">
                <v-card-subtitle> {{ item.subtitle }} </v-card-subtitle>
                <v-card-text> {{ item.description }} </v-card-text>
            </div>
            <v-card-actions>
                    <v-btn @click="closeDialog">Close</v-btn>
                    <v-btn v-if="btn" color="red" @click="submitDialog" >{{ btn }}</v-btn>
                    <span class="text-red ml-5"> {{ error }} </span>
                </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
export default {
    props: {
        title: String,
        visible: Boolean,
        info: Array as () => INFO[],
        error: String,
        btn: String,

    },
    methods: {
        closeDialog(){
            this.$emit('close');
        },
        submitDialog(){
            this.$emit('submit');
        },
    },
};
    interface INFO{
        subtitle?: String,
        description: string,
    };
</script>
