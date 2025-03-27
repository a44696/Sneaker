import { Card, Typography, Box } from "@mui/material";
import { Grid } from "@mui/material";
import { Title } from "react-admin";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import RefundIcon from "@mui/icons-material/ReplayCircleFilled";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import WalletIcon from "@mui/icons-material/AccountBalanceWallet";
import { useEffect, useState } from "react";
import axios from "axios";
import dayjs from "dayjs"; // Cần cài thư viện này để xử lý ngày tháng: npm install dayjs

const MetricCard = ({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) => (
  <Card
    sx={{
      height: "100%",
      display: "flex",
      alignItems: "center",
      padding: 2,
      backgroundColor: "#f5f6fa",
      borderRadius: 2,
      gap: 2,
    }}
  >
    <Box
      sx={{
        width: 50,
        height: 50,
        borderRadius: "50%",
        backgroundColor: "#e0f7fa",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </Box>
    <Box>
      <Typography variant="h6" fontWeight="bold" sx={{ color: "#000" }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ color: "#000" }}>
        {label}
      </Typography>
    </Box>
  </Card>
);

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [totalEarning, setTotalEarning] = useState(0);
  const [monthlyEarning, setMonthlyEarning] = useState([]);
  const [profitMargin, setProfitMargin] = useState(0);

  const fetchOrder = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/order/get-order-list");
      const orderData = response.data.data;

      setOrders(orderData);

      // Tính toán Total Earning (tổng tất cả totalAmt)
      const totalEarning = orderData.reduce((sum, order) => sum + (order.totalAmt || 0), 0);
      setTotalEarning(totalEarning);

      // Tính toán Monthly Earning (group theo tháng)
      const monthlyData = orderData.reduce((acc, order) => {
        const month = dayjs(order.createdAt).format("MMM YYYY"); // Group theo tháng, VD: "Mar 2025"
        if (!acc[month]) acc[month] = 0;
        acc[month] += order.totalAmt || 0;
        return acc;
      }, {});

      // Chuyển object thành array để hiển thị trên biểu đồ và sắp xếp tháng từ trước về sau
      const monthlyEarningArray = Object.entries(monthlyData)
        .map(([month, revenue]) => ({ month, revenue }))
        .sort((a, b) => dayjs(a.month, "MMM YYYY").isBefore(dayjs(b.month, "MMM YYYY")) ? -1 : 1);
      setMonthlyEarning(monthlyEarningArray);

      // Giả sử tính Profit Margin = tổng profit / tổng doanh thu (giả định profit = 20% doanh thu)
      const profit = totalEarning * 0.2; // Ví dụ: giả sử lợi nhuận là 20% doanh thu
      setProfitMargin(((profit / totalEarning) * 100).toFixed(2));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <>
      <Title title="Dashboard" />

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          Store Overview
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Welcome Back to Dashboard.
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4, color: "#000" }}>
          <Grid item xs={12} md={3}>
            <MetricCard
              icon={<WalletIcon color="primary" />}
              value={`$${totalEarning.toLocaleString()}`} // Hiển thị Total Earning
              label="Total Earning"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MetricCard
              icon={<AttachMoneyIcon color="primary" />}
              value={`$${monthlyEarning.length > 0 ? monthlyEarning[monthlyEarning.length - 1].revenue.toLocaleString() : 0}`}
              label="Monthly Earning" // Hiển thị doanh thu tháng gần nhất
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MetricCard
              icon={<RefundIcon color="primary" />}
              value="$4,434" // Placeholder, có thể thay đổi theo dữ liệu thực tế
              label="Total Refunds"
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <MetricCard
              icon={<TrendingUpIcon color="primary" />}
              value={`${profitMargin}%`}
              label="Profit Margin"
            />
          </Grid>
        </Grid>

        <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
          Revenue
        </Typography>

        <Box sx={{ height: 300, mt: 2 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyEarning}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#00bcd4" strokeWidth={3} dot={{ r: 6 }} />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </Box>
    </>
  );
};

export default Dashboard;
