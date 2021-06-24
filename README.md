# vuetify-music-player

## 界面


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

