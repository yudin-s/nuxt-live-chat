<template>
  <div class="content-body content-body-chat">
    <div class="panel" v-if="!isLoggedIn()">
      <div class="container-fluid h-100">
        <div class="row justify-content-center align-items-center h-100">
          <div class="col col-sm-6 col-md-6 col-lg-4 col-xl-3">
              <div class="form-group">
                <input class="form-control form-control-lg" placeholder="Login (can be any)" type="text"
                       v-model="sender">
              </div>
              <div class="form-group">
                <input class="form-control form-control-lg" placeholder="Chatroom" type="text" v-model="chatRoom">
              </div>
              <div class="form-group">
                <button type="button" class="btn btn-info btn-lg btn-block" @click="login()">Let's start!</button>
              </div>
          </div>
        </div>
      </div>
    </div>


    <div class="chat-panel" v-if="isLoggedIn()">
      <div class="chat-body">
        <div class="chat-body-header">

          <h6 class="tx-14 tx-color-01 mg-b-0 mg-l-10">Chat Room - {{chatRoom}}</h6>
        </div><!-- chat-body-header -->

        <div class="chat-body-content">
          <ul class="chat-msg-list">

            <div v-for="(messageArr, index) in messages" :key="index">
              <li class="divider-text">{{index}}</li>
              <message v-for="(message, index2) in messageArr" :key="index2" v-bind="message"/>
            </div>


          </ul>
        </div><!-- chat-body-content -->

        <div class="chat-body-footer">
          <div class="form-group">
            <input type="text" class="form-control" placeholder="Type something..." v-model="text">
          </div>
            <button type="button" class="fa fa-arrow-right" v-if="text.length" @click="sendMessage">Send <i
              data-feather="send"></i>
            </button>
        </div><!-- chat-body-footer -->
      </div><!-- chat-body -->
    </div><!-- chat-panel -->
  </div><!-- content-body -->

</template>

<script>

  import gql from "graphql-tag";
  import {groupBy, filter, map, each} from 'lodash';
  import moment from 'moment';
  import Message from "../components/Chat/Message";
  import PerfectScrollbar from 'perfect-scrollbar';

  const SUBSCRIPTION_CHAT = gql`
  subscription AllMessages {
  chat {
    id
    sender
    sender_token
    text
    created_at
    chat_room
  }
}
`;

  const QUERY_CHAT = gql`
  query AllMessages {
  chat {
    id
    sender
    sender_token
    text
    created_at
    chat_room
  }
}
`;
  const SEND_MESSAGE = gql`
  mutation MyMutation(
      $chatRoom: String!,
      $sender: String!,
      $senderToken: String!,
      $text: String!
  ) {
  insert_chat(objects: {chat_room: $chatRoom, sender: $sender, sender_token: $senderToken, text: $text}) {
    returning {
      id
    }
    affected_rows
  }
  }
`;

  export default {
    name: "index.vue",
    components: {Message},
    data() {
      let chatRoom = '';
      if (process.client) {
        chatRoom = location.hash;
        if (!chatRoom) {
          chatRoom = '';
        }
      }
      return {
        messages: [],
        chatRoom: chatRoom,
        sender: '',
        senderToken: '',
        text: '',

        psContent: null,
      };
    },
    mounted() {

    },

    methods: {
      isLoggedIn() {
        return this.senderToken.length != 0;
      },

      login() {
        this.senderToken = this.uuidv4();
        this.$apollo.query({
          query: QUERY_CHAT,

        }).then((res) => {
          var chat = res.data.chat;
          this.prepareMessages(chat);
          //  chat = filter(chat, {chat_room: this.chatRoom});
          this.messages = this.prepareMessages(chat);
          if (process.client) {

            if (!this.psContent) {
              this.psContent = new PerfectScrollbar('.chat-body-content', {
                suppressScrollX: true
              });

              this.$nextTick(() => {
                let content = this.$el.querySelector('.chat-body-content');
                if (content) {
                  content.scrollTop = content.scrollHeight;
                }
              })
            }
          }
        });
      },
      logout() {
        this.senderToken = '';
      },
      uuidv4() {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
          var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
      },

      sendMessage() {
        if (this.text.length) {
          this.$apollo.mutate({
            mutation: SEND_MESSAGE,
            variables: {
              chatRoom: this.chatRoom,
              sender: this.sender,
              senderToken: this.senderToken,
              text: this.text,
            }
          })
          this.text = '';
        }
      },

      prepareMessages(chat) {
        chat = filter(chat, {chat_room: this.chatRoom});
        let collection = [];

        each(chat, (item) => {
          collection.push({
            sender: item.sender,
            messages: [item.text],
            date: moment(item.created_at).format('LT'),
            sender_token: item.sender_token,
            itsMe: item.sender_token === this.senderToken,
          })
        });

        let groupedResults = groupBy(collection, (result) => {
            return moment(result.created_at).format('LL');
          }
        );
        return groupedResults;
      }
    },
    apollo: {
      $subscribe: {
        orders: {
          query: SUBSCRIPTION_CHAT,
          result(data) {
            var chat = data.data.chat;
            this.prepareMessages(chat);
            this.messages = this.prepareMessages(chat);
            this.$nextTick(() => {
              let content = this.$el.querySelector('.chat-body-content');
              if (content) {
                content.scrollTop = content.scrollHeight;
              }
            })

          }
        }
      }
    }
  }
</script>

<style lang="scss">

  .chat-body-show {
    @include media-breakpoint-down(md) {
      .chat-sidebar {
        display: none;
      }
      .chat-body {
        display: block;
      }
    }
  }

  .content-body-chat {
    height: calc(100vh - 60px);
    padding: 15px;

    @include media-breakpoint-up(sm) {
      height: calc(100vh - 70px);
      padding: 20px;
    }

    @include media-breakpoint-up(lg) {
      height: calc(100vh - 80px);
    }
  }

  .chat-header {
    background-color: transparent;
  }

  .chat-panel {
    position: relative;
    height: 100%;
  }

  .chat-sidebar {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    width: 100%;
    background-color: #fff;
    box-shadow: $shadow-01, $shadow-base;
    border: 1px solid darken($border-color, 2%);

    @include media-breakpoint-up(md) {
      width: 260px;
    }
    @include media-breakpoint-up(xl) {
      width: 280px;
    }
  }

  .chat-sidebar-header,
  .chat-sidebar-footer {
    height: 50px;
    display: flex;
    align-items: center;

    svg {
      width: 16px;
      height: 16px;
      stroke-width: 2.5px;
    }

    a {
      color: $color-text-04;
      @include hover-focus() {
        color: $color-text-02;
      }
    }
  }

  .chat-sidebar-header {
    justify-content: space-between;
    border-bottom: 1px solid $border-color;
    padding: 0 12px;
  }

  .chat-sidebar-footer {
    padding: 0 15px 0 16px;
    border-top: 1px solid $border-color;

    .chat-loggeduser {
      font-size: $font-size-sm;
      margin-bottom: 0;
      margin-left: 14px;

      span {
        color: $color-text-04;
        font-weight: 400;
      }
    }

    > div:last-child {
      margin-left: auto;
    }
  }

  .chat-sidebar-body {
    position: relative;
    height: calc(100% - 100px);
    overflow: hidden;
  }

  .chat-list {
    padding: 0;
    margin: 0;
    list-style: none;

    .avatar {
      flex-shrink: 0;
    }
  }

  .chat-item {
    display: flex;
    align-items: center;
    padding: 12px;
    position: relative;

    @include hover-focus() {
      background-color: darken($color-ui-01, 1%);
      cursor: default;
    }

    &.unread .chat-item-body {
      span:first-child {
        color: $color-text-01;
        font-weight: $font-weight-medium;
      }

      p {
        color: $color-text-02;
        font-weight: $font-weight-medium;
      }

      .chat-msg-count {
        display: flex;
      }
    }

    &.selected {
      background-color: darken($color-ui-01, 2.5%);

      .avatar::after {
        box-shadow: 0 0 0 1.5px $color-ui-02;
      }
    }
  }

  .chat-item-body {
    position: relative;
    margin-left: 12px;
    width: calc(100% - 50px);

    > div:first-child {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: $font-size-sm;
      line-height: 1.2;
      margin-bottom: 4px;

      span:first-child {
        color: $color-text-03;
      }

      span:last-child {
        font-size: 11px;
        color: $gray-600;
      }
    }

    p {
      color: $color-text-04;
      width: calc(100% - 15px);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      margin-bottom: 0;
      font-size: $font-size-xs;
    }
  }

  .chat-msg-count {
    width: 14px;
    height: 14px;
    background-color: $red;
    color: #fff;
    @include border-radius(100%);
    position: absolute;
    bottom: 3px;
    right: -2px;
    font-size: 8px;
    font-weight: 500;
    font-family: $font-family-sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
    display: none;
  }

  .chat-body {
    height: 100%;
    width: 100%;
    background-color: #fff;
    border: 1px solid darken($border-color, 2%);
    box-shadow: $shadow-01, $shadow-base;

  }

  .chat-body-header {
    height: 50px;
    border-bottom: 1px solid $border-color;
    display: flex;
    align-items: center;
    padding: 0 15px;
  }

  .chat-body-options {
    margin-left: auto;
    display: flex;
    align-items: center;

    a {
      color: $color-text-04;
      @include hover-focus() {
        color: $color-text-02;
      }

      + a {
        margin-left: 10px;
      }
    }

    svg {
      width: 18px;
      height: 18px;
    }
  }

  .chat-body-content {
    height: calc(100% - 100px);
    overflow: hidden;
    position: relative;
    background-color: #fff;
  }

  .chat-msg-list {
    padding: 15px;
    margin: 0;
    list-style: none;
  }

  .msg-item {
    display: flex;
    margin-bottom: 25px;

    .avatar {
      flex-shrink: 0;
    }

    &.reverse {
      flex-direction: row-reverse;
      text-align: right;

      .msg-body {
        margin-left: 0;
        margin-right: 10px;

        p span {
          background-color: $color-brand-01;
          color: #fff;
        }
      }
    }
  }

  .msg-body {
    flex: 1;
    margin-left: 15px;

    p {
      font-size: $font-size-sm;
      color: $color-text-03;
      margin-bottom: 5px;

      span {
        display: inline-block;
        background-color: $color-ui-02;
        padding: 7px 10px;

        @include media-breakpoint-up(xl) {
          max-width: 80%;
        }
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  .msg-user {
    font-size: $font-size-sm;
    margin-bottom: 15px;

    span {
      color: $color-text-04;
      font-size: 12px;
      font-weight: 400;
      margin-left: 5px;
    }
  }

  .chat-body-footer {
    height: 50px;
    padding: 0 15px;
    border-top: 1px solid $border-color;
    display: flex;
    align-items: center;
    background-color: #fff;

    .chat-body-options {
      margin-left: 0;
      margin-right: 15px;
    }

    .form-group {
      margin: 0;
      flex: 1;
    }

    .form-control {
      border-width: 0;
      padding: 0;
      font-size: $font-size-sm;
      color: $color-text-01;

      &:focus {
        box-shadow: none;
      }
    }
  }

</style>
