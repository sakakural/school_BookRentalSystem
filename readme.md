# この作品について
この作品は、sh03m2a5hによるもしもの時のためのWebアプリケーション版書籍貸出管理システムです。
# 勝手な自問自答コーナー
## なぜつくったの？
理由は至極単純です。作りたかったからです。  
他にも、これがあればグループでの開発時にこれを基として開発ができ、スムーズに開発を行うことができると考えたからです。  
## 本当にこれが参考になるのですか？
おそらくなると思います  
このアプリケーションではJSDocを乱用、オブジェクト指向の導入が進められていてとても読みやすく仕上がっています(当社比)  
そのため、同じオブジェクト指向言語であるC#だけでなくあらゆる言語での開発の参考になるはずです。
## あれ？でもコメントなくない？
そう、JSDocを乱用した結果コードエディタ上では大体マウスカーソル合わせれば何がやりたいかわかるようになってしまいました。  
そのため純粋なコメントは全然使っていません。本来作ってる人にはどっちも必要はないんですがね。
## コメントじゃなくてJSDocにした理由は？
JSDocを使うことによって通常JavaScriptでは困難なコード補完が行えると知ったからです。  
純粋なコメントではその場に記述するのみで他の部分には何も影響を与えません。  
しかしJSDocを使うことによって型を識別することが可能になりコード補完が効きまくります。  
あと、引数入力時に第何引数に何を入力すればいいかが一目瞭然になります。素晴らしいです。