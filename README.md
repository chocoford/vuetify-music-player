# vuetify-music-player

## 界面

![image-20210625152524137](./public/README/image-20210625152524137.png)

![image-20210625152541462](./public/README/image-20210625152541462.png)

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

```typescript
<v-music-player
    v-model="player"
    :avatarSrc="..."
    :fileSrc="..."
    :stream="true"
    :title="..."
    :authors="[...]"
    :historyPlaylistItemsInit="[]"
    :futurePlaylistItems="[]"
    bottom
    fixed
    dark
  />
```

## 选项

* `dark`: 指定主题
* `show`: 指定是否显示
* `avatarSrc`: 指定图片路径
* `fileSrc`: 指定歌曲文件路径
* `Authors`: 指定歌手（以Array形式）
* `futurePlaylistItems`: 播放列表
* `historyPlaylistItemsInit`: 初始历史记录
* `fixed`
* `abosulte`

## 插槽

* `centerLeading`：播放栏左侧位置
* `centerTrailing`: 播放栏右侧位置
* `right`: 音量调节右侧位置


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

