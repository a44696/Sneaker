import { Card, CardContent, Typography, Box} from "@mui/material"
import { Grid } from "@mui/material";
import { Title } from "react-admin"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const data = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 2000 },
  { month: "Apr", sales: 2780 },
  { month: "May", sales: 1890 },
  { month: "Jun", sales: 3390 },
  { month: "Jul", sales: 2490 },
]

const MetricCard = ({ value, percentage, label }: { value: string; percentage: string; label?: string }) => (
  <Card variant="outlined" sx={{ height: "100%" }}>
    <CardContent>
      {label && (
        <Typography variant="body2" color="text.secondary" gutterBottom>
          {label}
        </Typography>
      )}
      <Box display="flex" alignItems="baseline" gap={1}>
        <Typography variant="h4" component="div" fontWeight="bold">
          {value}
        </Typography>
        <Typography variant="body2" color="success.main">
          {percentage}
        </Typography>
      </Box>
    </CardContent>
  </Card>
)
 const Dashboard = () => (
  <>
    <Title title="Dashboard" />

    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
        Store Performance
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <MetricCard value="$10,000" percentage="+19%" />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard value="150" percentage="+25%" />
        </Grid>
        <Grid item xs={12} md={4}>
          <MetricCard value="300" percentage="+10%" />
        </Grid>
      </Grid>

      <Typography variant="h5" component="h2" fontWeight="bold" gutterBottom>
        Monthly Sales
      </Typography>
      <Typography variant="body2" color="text.secondary" gutterBottom>
        Revenue
      </Typography>

      <Box sx={{ height: 300, mt: 2 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} />
            <YAxis hide />
            <Bar dataKey="sales" fill="#888888" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </Box>
    </Box>
  </>
)

export default Dashboard;