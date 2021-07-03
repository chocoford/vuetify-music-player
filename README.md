# vuetify-music-player

![](https://img.shields.io/github/checks-status/chocoford/vuetify-music-player/master)
![](https://img.shields.io/npm/v/vuetify-music-player)
![GitHub](https://img.shields.io/github/license/chocoford/vuetify-music-player)

一款带播放列表的底边栏现代化播放器，内嵌有`插播`、`最后播放`等功能，可自定义额外按钮。

## 界面

![quicklook](public/README/quicklook.gif)

## Demo&Docs

[Docs](https://chocoford.github.io/vuetify-music-player/)

## 安装

```shell
 npm -i vuetify-music-player
```

```typescript
import VMusicPlayer from 'vuetify-music-player';
export default Vue.extend({
  components: {
    VMusicPlayer,
  },
  ...
```

## 使用

#### 安装

```typescript
// in main.ts(main.js)
import VMusicPlayer from 'vuetify-music-player';
Vue.use(VMusicPlayer);
...
```

### 全局播放

```typescript
// in your any *.vue file.
this.$player.play({
  avatarSrc: ..., // string
  title: ..., // string
  authors: ..., // string[]
  fileSrc: ..., // string
  duration: ..., // string 可以不指定
})
```

### 插播

```typescript
// in your any *.vue file.
this.$player.cutIn({
  avatarSrc: ..., // string
  title: ..., // string
  authors: ..., // string[]
  fileSrc: ..., // string
  duration: ..., // string 可以不指定
})
```

### 最后播放

```typescript
// in your any *.vue file.
this.$player.append({
  avatarSrc: ..., // string
  title: ..., // string
  authors: ..., // string[]
  fileSrc: ..., // string
  duration: ..., // string 可以不指定
})
```



| 选项       | 解释                     |
| ---------- | ------------------------ |
| `v-model`  | 指定是否显示             |
| `dark`     | 指定主题                 |
| `fixed`    | 指定`position: fixed`    |
| `abosulte` | 指定`position: abosulte` |



| 插槽             | 解释             |
| ---------------- | ---------------- |
| `centerLeading`  | 播放栏左侧位置   |
| `centerTrailing` | 播放栏右侧位置   |
| `right`          | 音量调节右侧位置 |



| 事件               | 返回类型  | 解释                   |
| ------------------ | --------- | ---------------------- |
| `didReplay`        | `boolean` | 是否进行了重播操作     |
| `didPlayInAdvance` | `boolean` | 是否进行了提前播放操作 |



## 示例

```vue

<template>
  <v-music-player v-model="player" bottom fixed :dark="dark">
    <template #centerLeading v-if="centerLeading">
      <v-btn icon class="my-auto"><v-icon>mdi-heart</v-icon></v-btn>
    </template>
    <template #centerTrailing v-if="centerTrailing">
      <v-btn icon class="my-auto"><v-icon>mdi-share</v-icon></v-btn>
    </template>
    <template #right v-if="right">
      <v-btn icon class="my-auto"><v-icon>mdi-shuffle-variant</v-icon></v-btn>
    </template>
  </v-music-player>
</template>


<script lang="ts">
  ...
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
    data: () => ({
      player: false,
      ...
    }),
    methods: {
      play(song: any) {
        this.$player.play(song)
      }
    },
    ...
  })
...
      
```



## 基本思路

```mermaid
graph LR;
			外部文件改变--放入历史记录tag=true-->play((播放));
			play-->loaded(loaded);
			loaded--获得时长-->放入历史记录if_tag=true;
			
			内部文件改变-->下一首;
			下一首-->将播放列表第0个元素插到历史记录中;
      内部文件改变-->上一首;
			上一首-->将历史记录第0个元素插到播放列表中;
			将播放列表第0个元素插到历史记录中--放入历史记录tag=false-->play;
			将历史记录第0个元素插到播放列表中--放入历史记录tag=false-->play;
```

## TODO

* 歌词
* UI优化
* 移动端UI优化
