# OUPharmacy System

Hệ thống quản lý nhà thuốc OUPharmacy được xây dựng với Next.js, TypeScript và TailwindCSS.

## 🚀 Tính năng

- **Quản lý thuốc**: Quản lý kho thuốc, theo dõi hạn sử dụng và số lượng tồn kho
- **Đặt lịch khám**: Hệ thống đặt lịch khám bệnh trực tuyến, quản lý lịch trình bác sĩ
- **Báo cáo thống kê**: Báo cáo chi tiết về doanh thu, tồn kho và hoạt động của nhà thuốc
- **Giao diện hiện đại**: Thiết kế responsive với TailwindCSS
- **TypeScript**: Đảm bảo type safety và code quality

## 🛠️ Công nghệ sử dụng

- **Next.js 14** - React framework với App Router
- **TypeScript** - Type-safe JavaScript
- **TailwindCSS** - Utility-first CSS framework
- **React 18** - UI library

## 📦 Cài đặt

1. **Clone repository**
   ```bash
   git clone <repository-url>
   cd oupharmacy-system
   ```

2. **Cài đặt dependencies**
   ```bash
   npm install
   # hoặc
   yarn install
   # hoặc
   pnpm install
   ```

3. **Chạy development server**
   ```bash
   npm run dev
   # hoặc
   yarn dev
   # hoặc
   pnpm dev
   ```

4. **Mở trình duyệt**
   Truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📁 Cấu trúc thư mục

```
oupharmacy-system/
├── src/
│   ├── app/                    # App Router (Next.js 13+)
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   ├── about/              # About page
│   │   └── contact/            # Contact page
│   └── components/             # Reusable components
│       ├── Button.tsx          # Button component
│       └── Card.tsx            # Card component
├── public/                     # Static assets
├── package.json
├── tsconfig.json              # TypeScript config
├── tailwind.config.js         # TailwindCSS config
├── next.config.js             # Next.js config
└── README.md
```

## 🎨 Customization

### Colors
Màu sắc có thể được tùy chỉnh trong `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        // ... các màu khác
      },
      secondary: {
        50: '#f8fafc',
        // ... các màu khác
      },
    },
  },
}
```

### Components
Các component có thể được tùy chỉnh trong thư mục `src/components/`:
- `Button.tsx` - Component button với các variant khác nhau
- `Card.tsx` - Component card cho layout

## 📝 Scripts

- `npm run dev` - Chạy development server
- `npm run build` - Build production
- `npm run start` - Chạy production server
- `npm run lint` - Chạy ESLint

## 🌐 Deployment

### Vercel (Recommended)
1. Push code lên GitHub
2. Kết nối repository với Vercel
3. Deploy tự động

### Other platforms
- **Netlify**: Sử dụng `npm run build` và deploy thư mục `.next`
- **Railway**: Sử dụng Dockerfile có sẵn
- **Docker**: Build và chạy với Docker

## 🤝 Contributing

1. Fork repository
2. Tạo feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

## 📞 Contact

- **Email**: contact@oupharmacy.com
- **Phone**: +84 123 456 789
- **Address**: 123 Đường ABC, Quận 1, TP.HCM

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [TailwindCSS](https://tailwindcss.com/) - CSS framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety