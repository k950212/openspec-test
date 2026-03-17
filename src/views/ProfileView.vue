<script setup lang="ts">
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'

import { useProfileStore } from '@/stores/profile'
import { useUiStore } from '@/stores/ui'

const profileStore = useProfileStore()
const uiStore = useUiStore()
const { profile } = storeToRefs(profileStore)

const form = reactive({
  name: profile.value.name,
  phone: profile.value.phone,
  address: profile.value.address,
})

function saveProfile() {
  profileStore.updateProfile({
    name: form.name,
    phone: form.phone,
    address: form.address,
  })

  form.name = profile.value.name
  form.phone = profile.value.phone
  form.address = profile.value.address

  uiStore.showSuccessToast('會員資料已儲存。', '會員資料已儲存')
}
</script>

<template>
  <main class="profile-page">
    <section class="profile-shell">
      <div class="profile-header">
        <p class="eyebrow">Member Profile</p>
        <h1>查看並更新會員資料</h1>
        <p class="heading-copy">你可以在這裡管理個人基本資料，並確認目前帳號所使用的聯絡資訊。</p>
      </div>

      <div class="profile-layout">
        <section class="profile-card profile-summary">
          <p class="section-label">目前資訊</p>
          <dl class="profile-list">
            <div>
              <dt>姓名</dt>
              <dd>{{ profile.name }}</dd>
            </div>
            <div>
              <dt>電話</dt>
              <dd>{{ profile.phone }}</dd>
            </div>
            <div>
              <dt>住址</dt>
              <dd>{{ profile.address }}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{{ profile.email }}</dd>
            </div>
          </dl>
        </section>

        <form class="profile-card profile-form" @submit.prevent="saveProfile">
          <p class="section-label">編輯個人資料</p>

          <label>
            姓名
            <a-input v-model:value="form.name" placeholder="請輸入姓名" size="large" />
          </label>

          <label>
            電話
            <a-input v-model:value="form.phone" placeholder="請輸入電話" size="large" />
          </label>

          <label>
            住址
            <a-textarea v-model:value="form.address" :rows="4" placeholder="請輸入住址" />
          </label>

          <label>
            Email
            <a-input :value="profile.email" type="email" size="large" readonly />
          </label>

          <button type="submit" class="primary-action">儲存會員資料</button>
        </form>
      </div>
    </section>
  </main>
</template>

<style scoped>
.profile-page {
  padding: 2rem 0 4rem;
}

.profile-shell {
  display: grid;
  gap: 1.5rem;
}

.eyebrow,
.section-label {
  color: var(--color-accent);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-weight: 700;
}

.profile-header h1 {
  margin-top: 0.4rem;
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.05;
  font-weight: 800;
  color: var(--color-heading);
}

.heading-copy {
  margin-top: 0.75rem;
  color: var(--color-text-soft);
}

.profile-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1.2fr);
  gap: 1rem;
  align-items: start;
}

.profile-card {
  border: 1px solid var(--color-border);
  border-radius: 24px;
  background:
    radial-gradient(circle at top left, rgba(255, 255, 255, 0.72), transparent 34%),
    linear-gradient(135deg, rgba(15, 118, 110, 0.06), rgba(214, 158, 46, 0.06)),
    var(--color-surface);
  box-shadow: var(--shadow-card);
  padding: 1.5rem;
}

.profile-list,
.profile-form {
  display: grid;
  gap: 1rem;
}

.profile-list div {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.profile-list dt {
  color: var(--color-heading);
  font-weight: 700;
}

.profile-list dd {
  color: var(--color-text-soft);
  text-align: right;
}

.profile-form label {
  display: grid;
  gap: 0.45rem;
  color: var(--color-heading);
  font-weight: 600;
}

:deep(.profile-form .ant-input),
:deep(.profile-form .ant-input-textarea textarea) {
  border-radius: 18px;
  border-color: var(--color-border);
  color: var(--color-heading);
  background: rgba(255, 255, 255, 0.82);
  box-shadow: none;
}

:deep(.profile-form .ant-input[readonly]) {
  background: var(--color-background-mute);
  color: var(--color-text-soft);
  cursor: default;
}

.primary-action {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: 0.95rem 1.2rem;
  border: 1px solid rgba(15, 118, 110, 0.24);
  border-radius: 999px;
  background: linear-gradient(135deg, #0f766e, #115e59);
  box-shadow: 0 1rem 2rem rgba(15, 118, 110, 0.18);
  color: #f7fbfc;
  font-weight: 700;
  cursor: pointer;
}

@media (max-width: 900px) {
  .profile-layout,
  .profile-list div {
    grid-template-columns: 1fr;
    flex-direction: column;
  }

  .profile-list dd {
    text-align: left;
  }
}
</style>
