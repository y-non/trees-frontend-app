<script setup></script>

<template>
  <div>
    <q-header class="q-py-sm header bg-green-8" elevated>
      <q-toolbar>
        <div class="flex justify-between full-width">
          <div class="flex"></div>

          <div>
            <q-toggle
              v-model="isDark"
              checked-icon="eva-moon-outline"
              color="orange"
              unchecked-icon="eva-sun-outline"
              @click="Dark.toggle()"
              class="q-mr-sm"
            />

            <q-chip>
              <q-avatar>
                <img
                  :src="
                    userData?.image_url
                      ? userData?.image_url
                      : 'https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg'
                  "
                />
              </q-avatar>
              <span>{{ userData?.display_name }}</span>
            </q-chip>
          </div>
        </div>
      </q-toolbar>
    </q-header>
  </div>
</template>

<style lang="scss" scoped></style>
