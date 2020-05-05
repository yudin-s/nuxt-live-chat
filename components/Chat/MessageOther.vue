<template>
  <li class="msg-item">
    <div class="avatar avatar-sm avatar-online"><img src="https://via.placeholder.com/500/637382/fff" class="rounded-circle" alt=""></div>
    <div class="msg-body">
      <h6 class="msg-user">@cheryl <span>Yesterday, at 12:00pm</span></h6>
      <p><span>I'm back once again!!</span></p>
      <p><span>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable.</span></p>
    </div>
  </li>
</template>

<script>
    export default {
        name: "MessageOther",
        props: {
            sender: {type: String},
            messages: {type: Array, default: ()=>[]},
            date: {type: String},
        }
    }
</script>

<style scoped>

</style>
