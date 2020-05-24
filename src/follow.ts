import 'playcanvas';   //PlayCanvasライブラリ

//クラスベースの場合はpc.ScriptTypeを継承する。
class Follow extends pc.ScriptType {

    public vec!: pc.Vec3;

    //TypeScript上ではアトリビュートは下記のattributes.addとは別に、フィールドとして別途設定しておく必要があります。
    //DRY原則に反していて面倒ですが、typeとクラス名を合わせれば正しくコード補完が効くので便利です。
    //(PlayCanvadのwebエディタではアトリビュートのコード補完は未対応のようです)
    //トランスパイル後にはこのフィールドは消える模様
    public target!: pc.Entity;
    public distance!: number;

    // update等の各種メソッドはprototype.メソッド名に関数を代入するのではなく、pc.ScriptTypeクラスのメソッドをオーバーライドする。

    // initialize code called once per entity
    public initialize() {
        this.vec = new pc.Vec3();
    }

    // update code called every frame

    public update(dt: number) {    //updateメソッドの引数であるdtはnumber型です。
        // called each tick

        if (!this.target) {
            return;
        }
        // get the position of the target entity
        var pos = this.target.getPosition();
        // calculate the desired position for this entity
        pos.x += 0.75 * this.distance;
        pos.y += 1.0 * this.distance;
        pos.z += 0.75 * this.distance;
        // smoothly interpolate towards the target position
        this.vec.lerp(this.vec, pos, 0.1);
        // set the position for this entity
        this.entity.setPosition(this.vec);
    }
}

//クラスベースで作る場合はpc.createScriptではなく、pc.registerScriptを使う。
//またコードの先頭ではなく、クラス定義の後に呼び出す。
pc.registerScript(Follow, "follow");

//アトリビュートはクラス定義かつpc.registerScriptの後に追加する
Follow.attributes.add('target', {
    type: 'entity',
    title: 'Target',
    description: 'The Entity to follow'
});

Follow.attributes.add('distance', {
    type: 'number',
    default: 4,
    title: 'Distance',
    description: 'How far from the Entity should the follower be'
});
