import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function ViewResults() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">
        Customer Satisfaction Survey Results
      </h1>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Survey Summary</CardTitle>
          <CardDescription>Overview of survey responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <h3 className="text-2xl font-bold">100</h3>
              <p className="text-muted-foreground">Total Responses</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold">4.2</h3>
              <p className="text-muted-foreground">Average Rating</p>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-bold">85%</h3>
              <p className="text-muted-foreground">Completion Rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Individual Responses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Respondent</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Comment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell>Respondent {i + 1}</TableCell>
                  <TableCell>{new Date().toLocaleDateString()}</TableCell>
                  <TableCell>{Math.floor(Math.random() * 5) + 1}</TableCell>
                  <TableCell>Sample comment {i + 1}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
