# 路由配置说明

## 当前路由结构

### 1. 主要路由
- `/` - 默认路由，重定向到 `/login`（未登录时）或作为管理后台布局（登录后）
- `/login` - 登录页面
- `*` - 404页面（匹配所有未定义的路由）

### 2. 管理后台嵌套路由 (直接在根路径下)
- `/` - 登录后，默认重定向到 `/dashboard`
- `/dashboard` - 仪表盘页面

### 3. 待扩展的路由（已注释，可按需启用）
```jsx
// 在 App.jsx 中可以添加：
<Route path="courses" element={<CoursesPage />} />
<Route path="teachers" element={<TeachersPage />} />
<Route path="users" element={<UsersPage />} />
<Route path="live" element={<LivePage />} />
```

### 4. 路由导航流程
1. 用户访问 `/` → 重定向到 `/login`（如果未登录）
2. 用户在登录页面成功登录 → 跳转到 `/dashboard`
3. 用户在管理后台可以通过侧边栏菜单导航到不同页面

## 文件说明

### App.jsx
- 定义了主要的路由结构
- 使用嵌套路由将管理后台路由组织在 `/admin` 下

### AdminLayout.jsx
- 提供管理后台的布局框架
- 包含侧边栏菜单、顶部导航、面包屑
- 使用 `<Outlet />` 渲染嵌套的子路由

### LoginPage.jsx
- 登录页面
- 登录成功后导航到 `/admin/dashboard`

### Dashboard.jsx
- 仪表盘组件
- 在 `/admin/dashboard` 路由下显示

## 如何添加新页面

1. 创建新的组件文件（如 `CoursesPage.jsx`）
2. 在 `App.jsx` 中添加新的路由：
   ```jsx
   <Route path="courses" element={<CoursesPage />} />
   ```
3. 在 `AdminLayout.jsx` 中添加新的菜单项：
   ```jsx
   {
       key: '/admin/courses',
       icon: <BookOutlined />,
       label: <Link to="/admin/courses">课程管理</Link>,
   }
   ```

## 权限控制建议

可以创建一个 `ProtectedRoute` 组件来保护需要登录的路由：

```jsx
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = /* 检查用户是否已登录 */;
  return isAuthenticated ? children : <Navigate to="/login" />;
};

// 在路由中使用
<Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
```
