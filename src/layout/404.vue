<template>
    <div class="not-found-container">
      <td-row align="middle" justify="center" class="not-found-content">
        <td-col :span="12">
          <td-typography.Title level="2" class="not-found-title">404</td-typography.Title>
          <td-typography.Text class="not-found-description">
            抱歉，页面资源没找到
          </td-typography.Text>
          <t-button type="primary" class="not-found-button" @click="goHome">点我回主页</t-button>
        </td-col>
      </td-row>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      goHome() {
        // Redirect to home page
        this.$router.push('/');
      }
    }
  }
  </script>
  
  <style scoped>
  .not-found-container {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .not-found-content {
    text-align: center;
  }
  
  .not-found-title {
    font-size: 64px;
  }
  
  .not-found-description {
    margin-bottom: 24px;
  }
  
  .not-found-button {
    font-size: 18px;
  }
  </style>
  