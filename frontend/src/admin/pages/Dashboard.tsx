import { Card,  Typography, Box } from "@mui/material";
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

const data = [
  { month: "Jun", revenue: 1000 },
  { month: "Jul", revenue: 2000 },
  { month: "Aug", revenue: 1500 },
  { month: "Sep", revenue: 3000 },
  { month: "Oct", revenue: 4000 },
  { month: "Nov", revenue: 5000 },
];

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
      <Typography variant="h6" fontWeight="bold" sx={{ color: '#000' }}>
        {value}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ color: '#000' }}>
        {label}
      </Typography>
    </Box>
  </Card>
);

const Dashboard = () => (
  <>
    <Title title="Dashboard" />

    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
        Store Overview
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Welcome Back to Dashboard.
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 ,color: '#000'}} >
        <Grid item xs={12} md={3}>
          <MetricCard
            icon={<WalletIcon color="primary" />}
            value="$52,54"
            label="Total Earning"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            icon={<AttachMoneyIcon color="primary" />}
            value="$4955"
            label="Monthly Earning"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            icon={<RefundIcon color="primary" />}
            value="$4,434"
            label="Total Refunds"
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <MetricCard
            icon={<TrendingUpIcon color="primary" />}
            value="80%"
            label="Profit Margin"
          />
        </Grid>
      </Grid>

      <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
        Revenue
      </Typography>

      <Box sx={{ height: 300, mt: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
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

export default Dashboard;
