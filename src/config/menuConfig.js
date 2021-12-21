const menuList = [
  {
    title: 'Home', // Menu item title
    key: '/home', 
    icon: 'home', 
    isPublic: true, 
  },
  {
    title: 'Product',
    key: '/products',
    icon: 'appstore',
    children: [ // Sub Menu
      {
        title: 'Category',
        key: '/category',
        icon: 'bars'
      },
      {
        title: 'Product Management',
        key: '/product',
        icon: 'tool'
      },
    ]
  },

  {
    title: 'User Management',
    key: '/user',
    icon: 'user'
  },
  {
    title: 'Role Management',
    key: '/role',
    icon: 'safety',
  },

  {
    title: 'Chart',
    key: '/charts',
    icon: 'area-chart',
    children: [
      {
        title: 'Bar Chart',
        key: '/charts/bar',
        icon: 'bar-chart'
      },
      {
        title: 'Line Chart',
        key: '/charts/line',
        icon: 'line-chart'
      },
      {
        title: 'Pie Chart',
        key: '/charts/pie',
        icon: 'pie-chart'
      },
    ]
  },

  {
    title: 'Order Management',
    key: '/order',
    icon: 'windows',
  },
]

export default menuList