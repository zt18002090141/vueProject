
const Mock = require('mockjs')

// 模拟验证码
const Random = Mock.Random

let Result = {
    code: 200,
    message: "操作成功！",
    data: null
}

Mock.mock('/captcha', 'get', () => {
    Result.data = {
        key: Random.toString(32),
        captchaImg: Random.dataImage('120x40', 'x1b0l')
    }
    return Result
})

Mock.mock('/login', 'post', () => {
    // console.log(Result);
    // Result.code=201
    // Result.message='xx'
    return Result
})

Mock.mock('/user/userInfo', 'get', () => {
    Result.data = {
        id: '1',
        username: 'jntm',
        avatar: require('@/assets/img/jntm.jpeg'),
    }
    return Result
})

Mock.mock('/logout', 'post', () => {
    return Result
})

Mock.mock('/menu/nav', 'get', () => {
    let menu_json = [
        {
            id: '1',
            name: 'sys:manage',
            title: '系统管理',
            icon: 'el-icon-s-operation',
            path: '',
            component: '',
            children: [
                {
                    id: '2',
                    name: 'sys:user:list',
                    title: '用户管理',
                    icon: 'el-icon-s-operation',
                    path: '/sys/users',
                    component: 'sys/systemMg/User',
                    children: []
                },
                {
                    id: '3',
                    name: 'sys:role:list',
                    title: '角色管理',
                    icon: 'el-icon-rank',
                    path: '/sys/roles',
                    component: 'sys/systemMg/Role',
                    children: []
                },
                {
                    id: '4',
                    name: 'sys:menu:list',
                    title: '菜单管理',
                    icon: 'el-icon-menu',
                    path: '/sys/menus',
                    component: 'sys/systemMg/Menu',
                    children: []
                }
            ]
        }, {
            id: '5',
            name: 'sys:tools',
            title: '系统工具',
            icon: 'el-icon-s-tools',
            path: '',
            component: '',
            children: [
                {
                    id: '6',
                    name: 'sys:dict:list',
                    title: '数据管理',
                    icon: 'el-icon-s-order',
                    path: '/sys/data',
                    component: 'sys/systemTool/Data',
                    children: []
                },
            ]
        }, {
            id: '7',
            name: 'sys:customer',
            title: '客户管理',
            icon: 'el-icon-user',
            path: '',
            component: '',
            children: [
                {
                    id: '8',
                    name: 'sys:member:list',
                    title: '会员管理',
                    icon: 'el-icon-s-custom',
                    path: '/sys/member',
                    component: 'sys/customerSys/Member',
                    children: []
                },
            ]
        }, {
            id: '9',
            name: 'sys:film',
            title: '电影管理',
            icon: 'el-icon-user',
            path: '',
            component: '',
            children: [
                {
                    id: '10',
                    name: 'sys:schedule:list',
                    title: '排片管理',
                    icon: 'el-icon-s-custom',
                    path: '/sys/schedule',
                    component: 'sys/movieSys/Schedule',
                    children: []
                }, {
                    id: '11',
                    name: 'sys:film:list',
                    title: '电影管理',
                    icon: 'el-icon-s-custom',
                    path: '/sys/film',
                    component: 'sys/movieSys/Film',
                    children: []
                }, {
                    id: '12',
                    name: 'sys:poster:list',
                    title: '轮播图管理',
                    icon: 'el-icon-s-custom',
                    path: '/sys/poster',
                    component: 'sys/movieSys/Poster',
                    children: []
                }
            ]
        }, {
            id: '13',
            name: 'sys:order',
            title: '订单管理',
            icon: 'el-icon-user',
            path: '',
            component: '',
            children: [
                {
                    id: '14',
                    name: 'sys:cart:list',
                    title: '购物车管理',
                    icon: 'el-icon-s-custom',
                    path: '/sys/cart',
                    component: 'sys/orderSys/Cart',
                    children: []
                }, {
                    id: '15',
                    name: 'sys:order:list',
                    title: '订单管理',
                    icon: 'el-icon-s-custom',
                    path: '/sys/order',
                    component: 'sys/orderSys/Order',
                    children: []
                }
            ]
        }
    ]

    let authoritys = ['sys:manage', 'sys:user:list']
    Result.data = {}
    Result.data.nav = menu_json
    Result.data.authoritys = authoritys
    return Result
})

Mock.mock('/system/menu/list', 'get', () => {
    let menus = [
        {
            id: 1,
            created: '2021-01-15T18:58:18',
            updated: '2021-01-15T18:58:20',
            statu: 1,
            parentId: 0,
            name: '系统管理',
            path: '',
            perms: 'sys:manage',
            component: '',
            type: 0,
            icon: 'el-icon-s-operation',
            ordernum: 1,
            children: [
                {
                    id: 2,
                    created: '2021-01-15T19:03:45',
                    updated: '2021-01-15T19:03:48',
                    statu: 1,
                    parentId: 1,
                    name: '用户管理',
                    path: '/system/users',
                    perms: 'sys:user:list',
                    component: 'system/User',
                    type: 1,
                    icon: 'el-icon-s-custom',
                    ordernum: 1,
                    children: [
                        {
                            id: 9,
                            created: '2021-01-17T21:48:32',
                            updated: null,
                            statu: 1,
                            parentId: 2,
                            name: '添加用户',
                            path: null,
                            perms: 'sys:user:save',
                            component: null,
                            type: 2,
                            icon: null,
                            ordernum: 1,
                            children: [],
                        },
                        {
                            id: 10,
                            created: '2021-01-17T21:49:03',
                            updated: '2021-01-17T21:53:04',
                            statu: 1,
                            parentId: 2,
                            name: '修改用户',
                            path: null,
                            perms: 'sys:user:update',
                            component: null,
                            type: 2,
                            icon: null,
                            ordernum: 2,
                            children: [],
                        },
                        {
                            id: 11,
                            created: '2021-01-17T21:49:21',
                            updated: null,
                            statu: 1,
                            parentId: 2,
                            name: '删除用户',
                            path: null,
                            perms: 'sys:user:delete',
                            component: null,
                            type: 2,
                            icon: null,
                            ordernum: 3,
                            children: [],
                        },
                        {
                            id: 12,
                            created: '2021-01-17T21:49:58',
                            updated: null,
                            statu: 1,
                            parentId: 2,
                            name: '分配角色',
                            path: null,
                            perms: 'sys:user:role',
                            component: null,
                            type: 2,
                            icon: null,
                            ordernum: 4,
                            children: [],
                        },
                        {
                            id: 13,
                            created: '2021-01-17T21:50:36',
                            updated: null,
                            statu: 0,
                            parentId: 2,
                            name: '重置密码',
                            path: null,
                            perms: 'sys:user:repass',
                            component: null,
                            type: 2,
                            icon: null,
                            ordernum: 5,
                            children: [],
                        },
                    ],
                },
                {
                    id: 3,
                    created: '2021-01-15T19:03:45',
                    updated: '2021-01-15T19:03:48',
                    statu: 1,
                    parentId: 1,
                    name: '角色管理',
                    path: '/system/roles',
                    perms: 'sys:role:list',
                    component: 'system/Role',
                    type: 1,
                    icon: 'el-icon-rank',
                    ordernum: 2,
                    children: [],
                },
            ],
        },
        {
            id: 5,
            created: '2021-01-15T19:06:11',
            updated: null,
            statu: 1,
            parentId: 0,
            name: '系统工具',
            path: '',
            perms: 'sys:tools',
            component: null,
            type: 0,
            icon: 'el-icon-s-tools',
            ordernum: 2,
            children: [
                {
                    id: 6,
                    created: '2021-01-15T19:07:18',
                    updated: '2021-01-18T16:32:13',
                    statu: 1,
                    parentId: 5,
                    name: '数字字典',
                    path: '/system/dicts',
                    perms: 'sys:dict:list',
                    component: 'system/Dict',
                    type: 1,
                    icon: 'el-icon-s-order',
                    ordernum: 1,
                    children: [],
                },
            ],
        },
    ]
    Result.data = menus
    return Result
})

//模拟：响应删除菜单的操作，传递参数菜单编号id
//* 表示执行操作是：delete（删除）  save（保存）  update（更新）
Mock.mock(RegExp('/system/menu/*'), 'post', () => {
    //代表模拟删除、插入、更新操作都是成功的。
    return Result
})


//根据菜单的编号获得菜单对象信息
////管理菜单，根据菜单 Id查询该菜单详细信息/////////////////
Mock.mock(RegExp('/system/menu/info/*'), 'get', () => {
    Result.data = {
        id: 3,
        statu: 1,
        parentId: 1,
        name: '角色管理',
        path: '/system/roles',
        perms: 'sys:role:list',
        component: 'system/Role',
        type: 1,
        icon: 'el-icon-rank',
        orderNum: 2,
        children: [],
    }
    return Result
})

//获得所有的角色信息
///请求获得服务器 角色列表 信息///    正则表达式
// * 代表就所搜时候 模糊查询传递的参数
Mock.mock(RegExp('/system/role/list*'), 'get', () => {
    Result.data = {
        //records封装分页的数据
        records: [
            {
                id: 3,
                created: '2021-01-04T10:09:14',
                updated: '2021-01-30T08:19:52',
                statu: 1,
                name: '普通用户',
                code: 'normal',
                remark: '只有基本查看功能',
                menuIds: [],
            },
            {
                id: 6,
                created: '2021-01-16T13:29:03',
                updated: '2021-01-17T15:50:45',
                statu: 0,
                name: '超级管理员',
                code: 'admin',
                remark: '系统默认最高权限，不可以编辑和任意修改 ',
                menuIds: [],
            },
        ],
        total: 2, //当前总记录数
        size: 10, //一页显示多少数据
        current: 1, //当前页码
        orders: [],
        optimizeCountSql: true,
        hitCount: false,
        countId: null,
        maxLimit: null,
        searchCount: true,
        pages: 1, //一共有多少页
    }
    return Result
})

//////通过角色id获得角色信息///////   RestFul
//* 参数就是传递角色编号 /system/role/info/6
Mock.mock(RegExp('/system/role/info/*'), 'get', () => {
    Result.data = {
        id: 6,
        created: '2021-01-16T13:29:03',
        updated: '2021-01-17T15:50:45',
        statu: 1,
        name: '超级管理员',
        code: 'admin',
        remark: '系统默认最高权限，不可以编辑和任意修改',
        menuIds: [9, 10, 11, 12, 13], //菜单id数组，就是该角色权限信息
    }

    return Result
})

///////////保存或更新 、删除 角色方法////////////
//* 代表传递参数，update是更新角色，save要保存新角色
Mock.mock(RegExp('/system/role/*'), 'post', () => {
    return Result
})

///获得所有用户的信息////
//////////////// 用户管理 ////////////////
Mock.mock(RegExp('/system/user/list*'), 'get', () => {
    Result.data = {
        records: [
            {
                id: 1,
                created: '2021-01-12T22:13:53',
                updated: '2021-01-16T16:57:32',
                statu: 1,
                username: 'admin',
                password:
                    '$2a$10$oPaOFhl1IYrUgHj3kcpW7OJYR9N9wGudceRdNVIs8aSY4Q7rLCGuK', //123123
                avatar:
                    'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fblog%2F202107%2F09%2F20210709142454_dc8dc.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1666333236&t=3733d94221afc7ea3189dc0ffa30fd47',
                email: '999@qq.com',
                tel: '15343517807',
                lastLogin: '2020-12-30T08:38:37',
                roles: [
                    {
                        id: 6,
                        created: '2021-01-16T13:29:03',
                        updated: '2021-01-17T15:50:45',
                        statu: 1,
                        name: '超级管理员',
                        code: 'admin',
                        remark: '系统默认最高权限，不可以编辑和任意修改',
                        menuIds: [],
                    },
                    {
                        id: 3,
                        created: '2021-01-04T10:09:14',
                        updated: '2021-01-30T08:19:52',
                        statu: 1,
                        name: '普通用户',
                        code: 'normal',
                        remark: '只有基本查看功能',
                        menuIds: [],
                    },
                ],
            },
            {
                id: 2,
                created: '2021-01-30T08:20:22',
                updated: '2021-01-30T08:55:57',
                statu: 1,
                username: 'test',
                password:
                    '$2a$10$oPaOFhl1IYrUgHj3kcpW7OJYR9N9wGudceRdNVIs8aSY4Q7rLCGuK',
                avatar:
                    'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201908%2F19%2F20190819150344_ALnaX.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1666333236&t=a23b8c8c9f154ea09f54728b6e04e7f9',
                email: 'test@qq.com',
                tel: 133667788899,
                lastLogin: null,
                roles: [
                    {
                        id: 3,
                        created: '2021-01-04T10:09:14',
                        updated: '2021-01-30T08:19:52',
                        statu: 1,
                        name: '普通用户',
                        code: 'normal',
                        remark: '只有基本查看功能',
                        menuIds: [],
                    },
                ],
            },
        ],
        total: 2,
        size: 10,
        current: 1,
        orders: [],
        optimizeCountSql: true,
        hitCount: false,
        countId: null,
        maxLimit: null,
        searchCount: true,
        pages: 1,
    }
    return Result
})

//根据用户编号id 获得用户信息
Mock.mock(RegExp('/system/user/info/*'), 'get', () => {
    Result.data = {
        id: 2,
        created: '2022-01-30T08:20:22',
        updated: '2022-01-30T08:55:57',
        statu: 1,
        username: 'test',
        password: '$2a$10$oPaOFhl1IYrUgHj3kcpW7OJYR9N9wGudceRdNVIs8aSY4Q7rLCGuK',
        avatar:
            'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201908%2F19%2F20190819150344_ALnaX.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1666333236&t=a23b8c8c9f154ea09f54728b6e04e7f9',
        email: '999@qq.com',
        tel: '15343517807',
        lastLogin: null,
        roles: [
            //该用户目前所拥有的角色对象
            {
                id: 6,
                created: '2021-01-16T13:29:03',
                updated: '2021-01-17T15:50:45',
                statu: 1,
                name: '超级管理员',
                code: 'admin',
                remark: '系统默认最高权限，不可以编辑和任意修改',
                menuIds: [],
            },
            {
                id: 3,
                created: '2021-01-04T10:09:14',
                updated: '2021-01-30T08:19:52',
                statu: 1,
                name: '普通用户',
                code: 'normal',
                remark: '只有基本查看功能',
                menuIds: [],
            },
        ],
    }
    return Result
})

//更新密码 /system/user/repass
Mock.mock(RegExp('/system/user/*'), 'post', () => {
    return Result
})


// 会员信息
Mock.mock(RegExp('/system/member/list*'), 'get', () => {
    Result.data = {
        member: [{
            id: 1,
            username: 'text1',
            password: '123',
            avatar: require('@/assets/img/jntm.jpeg'),
            nickname: '只因123',
            email: '123@qq.com',
            birthday: '2000-08-18',
            gender: '男',
            info: 'xxx',
            created: '2021-01-04T10:09:14',
            statu: 1
        }, {
            id: 2,
            username: 'text2',
            password: '123',
            avatar: require('@/assets/img/jntm.jpeg'),
            nickname: '只因123',
            email: '123@qq.com',
            birthday: '2000-08-18',
            gender: '男',
            info: 'xxx',
            created: '2021-01-04T10:09:14',
            statu: 1
        }, {
            id: 2,
            username: 'text3',
            password: '123',
            avatar: require('@/assets/img/jntm.jpeg'),
            nickname: '只因123',
            email: '123@qq.com',
            birthday: '2000-08-18',
            gender: '男',
            info: 'xxx',
            created: '2021-01-04T10:09:14',
            statu: 0
        }],
        total: 3,
        size: 10,
        current: 1,
        orders: [],
        optimizeCountSql: true,
        hitCount: false,
        countId: null,
        maxLimit: null,
        searchCount: true,
        pages: 1,
    }

    return Result
})
// 修改update 保存save
Mock.mock(RegExp('/system/member/*'), 'post', () => {
    return Result
})

// 获取某个会员信息id

Mock.mock(RegExp('/system/member/info/*'), 'get', () => {
    Result.data = {
        id: 1,
        username: 'text1',
        password: '123',
        avatar: require('@/assets/img/jntm.jpeg'),
        nickname: '只因123',
        email: '123@qq.com',
        birthday: '2000-08-18',
        gender: '男',
        info: 'xxx',
        created: '2021-01-04T10:09:14',
        statu: 1
    }
    return Result
})

// 轮播图(查询)
Mock.mock(RegExp('/system/poster/list*'), 'get', () => {
    Result.data = {
        records: [{
            id: 1,
            title: '名侦探柯南-绯色的子弹',
            url: require('@/assets/img/fsdzd.jpg'),
            created: '2021-01-04T10:09:14',
            updated: '2021-01-04T10:09:14',
            statu: 1
        }, {
            id: 2,
            title: '名侦探柯南-万圣节的新娘',
            url: require('@/assets/img/wsjdxn.jpg'),
            created: '2021-01-04T10:09:14',
            updated: '2021-01-04T10:09:14',
            statu: 1
        }, {
            id: 3,
            title: '名侦探柯南-业火的向日葵',
            url: require('@/assets/img/yhdxrk.jpg'),
            created: '2021-01-04T10:09:14',
            updated: '2021-01-04T10:09:14',
            statu: 1
        }, {
            id: 4,
            title: '名侦探柯南-绀青之拳',
            url: require('@/assets/img/gqzq.jpg'),
            created: '2021-01-04T10:09:14',
            updated: '2021-01-04T10:09:14',
            statu: 1
        }, {
            id: 5,
            title: '名侦探柯南-第十一名前锋',
            url: require('@/assets/img/dsymqf.jpg'),
            created: '2021-01-04T10:09:14',
            updated: '2021-01-04T10:09:14',
            statu: 0
        }],
        total: 3,
        size: 10,
        current: 1,
        orders: [],
        optimizeCountSql: true,
        hitCount: false,
        countId: null,
        maxLimit: null,
        searchCount: true,
        pages: 1,
    }
    return Result
})
// update,save
Mock.mock(RegExp('/system/poster/*'), 'post', () => {
    return Result
})
//delete
// Mock.mock(RegExp('/system/poster/delete/*'), 'post', () => {
//     return Result
// })
//getbyid
Mock.mock(RegExp('/system/poster/info/*'), 'get', () => {
    Result.data = {
        id: 4,
        title: '名侦探柯南-绀青之拳',
        url: 'https://pic.lndayp.com/uploads/vod/2021-09-08/f4c67a46f5f8d7f7ba333d79cfd55cdb.jpg',
        created: '2021-01-04T10:09:14',
        updated: '2021-01-04T10:09:14',
        statu: 0
    }
    return Result
})


// 电影
Mock.mock(RegExp('/system/film/list*'), 'get', () => {
    Result.data = {
        records: [{
            id: 1,
            name: '名侦探柯南-绀青之拳',
            type: '动漫',
            region: '日本',
            hot: 2301,
            introduction: 'xxx',
            cover: 'https://pic.lndayp.com/uploads/vod/2021-09-08/f4c67a46f5f8d7f7ba333d79cfd55cdb.jpg',
            duration: 120,
            statu: 1,
            created: '2021-01-04T10:09:14',
            updated: '2021-01-04T10:09:14',
            is_delete: 0
        }, {
            id: 2,
            name: '名侦探柯南-绀青之拳',
            type: '动漫',
            region: '日本',
            hot: 2301,
            introduction: 'xxx',
            cover: 'https://pic.lndayp.com/uploads/vod/2021-09-08/f4c67a46f5f8d7f7ba333d79cfd55cdb.jpg',
            duration: 120,
            statu: 0,
            created: '2021-01-04T10:09:14',
            updated: '2021-01-04T10:09:14',
            is_delete: 0
        }, {
            id: 3,
            name: '名侦探柯南-绀青之拳',
            type: '动漫',
            region: '日本',
            hot: 2301,
            introduction: 'xxx',
            cover: 'https://pic.lndayp.com/uploads/vod/2021-09-08/f4c67a46f5f8d7f7ba333d79cfd55cdb.jpg',
            duration: 120,
            statu: 2,
            created: '2021-01-04T10:09:14',
            updated: '2021-01-04T10:09:14',
            is_delete: 0
        }],
        total: 3,
        size: 10,
        current: 1,
        orders: [],
        optimizeCountSql: true,
        hitCount: false,
        countId: null,
        maxLimit: null,
        searchCount: true,
        pages: 1,
    }
    return Result
})

// update,save
Mock.mock(RegExp('/system/film/*'), 'post', () => {
    return Result
})
Mock.mock(RegExp('/system/film/info/*'), 'get', () => {
    Result.data = {
        id: 3,
        name: '名侦探柯南-绀青之拳',
        type: '动漫',
        region: '日本',
        hot: 2301,
        introduction: 'xxx',
        cover: 'https://pic.lndayp.com/uploads/vod/2021-09-08/f4c67a46f5f8d7f7ba333d79cfd55cdb.jpg',
        duration: 120,
        statu: 2,
        created: '2021-01-04T10:09:14',
        updated: '2021-01-04T10:09:14',
        is_delete: 0
    }
    return Result
})

// 排片
Mock.mock(RegExp('/system/arrangerment/list*'), 'get', () => {
    Result.data = {
        records: [{
            id: 1,
            fid: 1,
            name: '名侦探柯南-万圣节的新娘',
            seat_number: 40,
            box_office: 3000,
            price: 38,
            type: '2D',
            date: '2022-11-18',
            start_time: '13:00:00',
            end_time: '14:30:00',
            founder: 'xx',
            created: '2021-01-04T10:09:14',
            updated: '2021-01-04T10:09:14',
            statu: 1
        }, {
            id: 2,
            fid: 2,
            name: '名侦探柯南-万圣节的新娘',
            seat_number: 40,
            box_office: 3000,
            price: 38,
            type: '2D',
            date: '2022-11-18',
            start_time: '13:00:00',
            end_time: '14:30:00',
            founder: 'xx',
            created: '2021-01-04T10:09:14',
            updated: '2021-01-04T10:09:14',
            statu: 0
        }],
        total: 3,
        size: 10,
        current: 1,
        orders: [],
        optimizeCountSql: true,
        hitCount: false,
        countId: null,
        maxLimit: null,
        searchCount: true,
        pages: 1,
    }
    return Result
})

// update,save
Mock.mock(RegExp('/system/arrangerment/*'), 'post', () => {
    return Result
})
Mock.mock(RegExp('/system/arrangerment/info/*'), 'get', () => {
    Result.data = {
        id: 2,
        fid: 2,
        name: '名侦探柯南-万圣节的新娘',
        seat_number: 40,
        box_office: 3000,
        price: 38,
        type: '2D',
        date: '2022-11-18',
        start_time: '13:00:00',
        end_time: '14:30:00',
        founder: 'xx',
        created: '2021-01-04T10:09:14',
        updated: '2021-01-04T10:09:14',
        statu: 0
    }
    return Result
})


// cart
// 排片
Mock.mock(RegExp('/system/cart/list*'), 'get', () => {
    Result.data = {
        records: [{
            id: 1,
            uid: 1,
            aid: 1,
            phone:'17611111111',
            seats:'12排4座',
            price:40,
            created: '2021-01-04T10:09:14',
            updated: '2021-01-04T10:09:14',
            statu: 1
        }, {
            id: 1,
            uid: 1,
            aid: 1,
            phone:'17611111111',
            seats:'12排4座',
            price:40,
            created: '2021-01-04T10:09:14',
            updated: '2021-01-04T10:09:14',
            statu: 1
        }],
        total: 3,
        size: 10,
        current: 1,
        orders: [],
        optimizeCountSql: true,
        hitCount: false,
        countId: null,
        maxLimit: null,
        searchCount: true,
        pages: 1,
    }
    return Result
})


// order
Mock.mock(RegExp('/system/order/list*'), 'get', () => {
    Result.data = {
        records: [{
            id: 1,
            uid: 1,
            aid: 1,
            phone:'17611111111',
            seats:'12排4座',
            price:40,
            pay_at:'2021-01-04T10:09:14',
            created: '2021-01-04T10:09:14',
            updated: '2021-01-04T10:09:14',
            statu: 1
        }, {
            id: 1,
            uid: 1,
            aid: 1,
            phone:'17611111111',
            seats:'12排4座',
            price:40,
            pay_at:'2021-01-04T10:09:14',
            created: '2021-01-04T10:09:14',
            updated: '2021-01-04T10:09:14',
            statu: 1
        }],
        total: 3,
        size: 10,
        current: 1,
        orders: [],
        optimizeCountSql: true,
        hitCount: false,
        countId: null,
        maxLimit: null,
        searchCount: true,
        pages: 1,
    }
    return Result
})