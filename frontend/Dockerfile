# Bước 1: Chọn môi trường Node.js phiên bản 20 gọn nhẹ
FROM node:20-alpine

# Bước 2: Tạo thư mục làm việc
WORKDIR /app

# Bước 3: Copy các file quản lý thư viện vào trước
COPY package.json package-lock.json* ./

# Bước 4: Cài đặt các package của Node
RUN npm install

# Bước 5: Copy toàn bộ source code React vào
COPY . .

# Bước 6: Mở cổng 3000 cho React
EXPOSE 3000

# Bước 7: Khởi chạy local server của React
CMD ["npm", "start"]