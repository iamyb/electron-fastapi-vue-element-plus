<script setup lang="ts">
import { ref, computed } from "vue";
import { ElMessage } from "element-plus";

defineProps<{ msg: string }>();

const count = ref(0);
const input = ref("element-plus");

const curDate = ref("");

const toast = () => {
  ElMessage.success("Hello");
};

const value1 = ref(true);

const fileInfo = ref({path:'', info:null})

async function onOpenFileBtnClick() {
  const fileInfoResp = await window.electronAPI.openFile()
  if (fileInfoResp&&fileInfoResp.path) {
    fileInfo.value = fileInfoResp
  }
  const backendURL = await window.electronAPI.getBackendUrl();
  // console.log(backendURL)
}

const size=ref('small')
const blockMargin = computed(() => {
  const marginMap = {
    large: '32px',
    default: '28px',
    small: '24px',
  }
  return {
    marginTop: marginMap[size.value] || marginMap.default,
  }
})
</script>

<template>
  <!-- <h1 color="$ep-color-primary">{{ msg }}</h1>

  <p>
    See
    <a href="https://element-plus.org" target="_blank">element-plus</a> for more
    information.
  </p> -->

  <!-- example components -->
  <!-- <div class="mb-4">
    <el-button size="large" @click="toast">El Message</el-button>
  </div> -->
  <div class="mb-4">
    <el-button type="primary" size="large" @click="onOpenFileBtnClick"><el-icon><Folder /></el-icon>Open Folder</el-button>
  </div>
  <div class="mb-4">
    <el-table v-if="fileInfo.path" :data="fileInfo.info" style="width: 100%">
      <el-table-column prop="name" label="Name" min-width="180" show-overflow-tooltip>
        <template #default="scope">
          <div style="display: flex; align-items: center">
            <el-icon v-if="scope.row.type=='directory'"><Folder /></el-icon>
            <el-icon v-if="scope.row.type=='file'"><Document /></el-icon>
            <span style="margin-left: 10px">{{ scope.row.name }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="size" label="Size" min-width="100" />
      <el-table-column prop="created" label="Created" min-width="180" show-overflow-tooltip/>
      <el-table-column prop="modified" label="Modified" min-width="180" show-overflow-tooltip/>
      <!-- <el-table-column prop="type" label="Type" min-width="180" /> -->
    </el-table>
  </div>
  <!-- <div class="my-2 text-center flex flex-wrap justify-center items-center">
    <el-button @click="count++">count is: {{ count }}</el-button>
    <el-button type="primary" @click="count++">count is: {{ count }}</el-button>
    <el-button type="success" @click="count++">count is: {{ count }}</el-button>
    <el-button type="warning" @click="count++">count is: {{ count }}</el-button>
    <el-button type="danger" @click="count++">count is: {{ count }}</el-button>
    <el-button type="info" @click="count++">count is: {{ count }}</el-button>
  </div> -->

  <!-- <div>
    <el-tag type="success" class="m-1">Tag 1</el-tag>
    <el-tag type="warning" class="m-1">Tag 1</el-tag>
    <el-tag type="danger" class="m-1">Tag 1</el-tag>
    <el-tag type="info" class="m-1">Tag 1</el-tag>
  </div> -->

  <!-- <div>
    <el-switch v-model="value1" />
    <el-switch
      v-model="value1"
      class="m-2"
      style="--ep-switch-on-color: black; --ep-switch-off-color: gray;"
    />
  </div> -->

  <!-- <div class="my-2">
    <el-input class="m-2" v-model="input" style="width: 200px" />
    <el-date-picker
      class="m-2"
      v-model="curDate"
      type="date"
      placeholder="Pick a day"
    ></el-date-picker>
  </div> -->

  <!-- <p>For example, we can custom primary color to 'green'.</p>

  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test components.
  </p>
  <p>
    Edit
    <code>styles/element/var.scss</code> to test scss variables.
  </p>

  <p>
    Full Example:
    <a
      href="https://github.com/element-plus/element-plus-vite-starter"
      target="_blank"
      >element-plus-vite-starter</a
    >
    | On demand Example:
    <a
      href="https://github.com/element-plus/unplugin-element-plus"
      target="_blank"
      >unplugin-element-plus/examples/vite</a
    >
  </p> -->
</template>

<style>
.ep-button {
  margin: 4px;
}
.ep-button + .ep-button {
  margin-left: 0;
  margin: 4px;
}
</style>
