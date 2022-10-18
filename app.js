const express = require('express');
const app = express();
var db = require('./db.js');
// 设置请求参数类型
// app.use(express.urlencoded());
app.use(express.json());
app.get('/', async (req, res) => {
    try {
        let back = await db.getDb();
        res.send(back.user);
    } catch (e) {
        res.status(500).json({ e });
    }
});

app.post('/', async (req, res) => {
    let body = req.body;
    if (!body) {
        res.status(403).json({ error: '缺少用户信息' });
    }

    let dbData = await db.getDb();
    body.id = dbData.user[dbData.user.length - 1].id + 1;

    dbData.user.push(body);
    try {
        let w = await db.serveDb(dbData);
        if (!w) {
            res.status(200).send({ msg: '添加成功', code: 0 });
        }
    } catch (e) {
        res.status(500).json({ e });
    }
});

app.put('/:id', async (req, res) => {
    try {
        const userInfo = await db.getDb();
        let userId = Number.parseInt(req.params.id);
        const user = userInfo.user.find(item => item.id === userId);
        if (!user) {
            res.status(403).json({
                error: '用户不存在',
            });
            return;
        }

        const body = req.body;
        user.username = body.username ? body.username : user.username;
        user.age = body.age ? body.age : user.age;
        userInfo.user[userId - 1] = user;
        if (!(await db.serveDb(userInfo))) {
            res.status(200).json({
                msg: '修改成功',
                code: 0,
            });
        }
    } catch (e) {
        res.status(500).json({ e });
    }
});

app.listen(3000, () => {
    console.log('Run http://127.0.0.1:3000');
});
