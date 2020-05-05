<template>
  <li class="msg-item" :class="{reverse: itsMe}">
    <div class="avatar avatar-sm avatar-online"><img :src="makeImageUrl"
                                                     class="rounded-circle" alt=""></div>
    <div class="msg-body">
      <h6 class="msg-user">@{{sender}} <span>{{date}}</span></h6>
      <p v-for="(message, index) in messages" :key="index"><span v-html="message"/></p>
    </div>
  </li>
</template>

<script>
  export default {
    name: "Message",
    props: {
      sender: {type: String},
      messages: {type: Array, default: () => []},
      date: {type: String},
      sender_token: {type: String},
      itsMe: {type: Boolean}
    },
    computed: {
        makeImageUrl(){
          return 'https://picsum.photos/seed/'+this.sender_token+'/100';
        }
    },
  }
</script>

<style>

</style>
