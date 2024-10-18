import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { unitAvailable } from '@/lib/options';

type Props = {
  onFilter: (filter: { unit?: string }) => void;
  onClose: () => void;
};

export const Filter = ({ onClose, onFilter }: Props) => {
  const formSchema = z.object({
    unit: z.string().optional(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onFilter(values);
  };

  return (
    <div className="absolute right-20 mt-2 w-64 bg-white rounded-lg shadow-xl z-10">
      <div className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem className="text-start">
                  <FormLabel className="text-gray-700 font-bold">
                    Đơn vị
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger spellCheck>
                        <SelectValue placeholder="Chọn đơn vị" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(unitAvailable).map(([key, text]) => (
                        <SelectItem key={key} value={key}>
                          {text}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="space-x-4">
              <Button variant="secondary" onClick={onClose}>
                Hủy
              </Button>
              <Button type="submit">Lọc</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};
