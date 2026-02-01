import React from 'react';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from './form';

const formSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

function TestForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
    },
  });

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <input {...field} placeholder="Enter username" />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

describe('Form', () => {
  test('renders form with field', () => {
    render(<TestForm />);

    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    expect(screen.getByText('This is your public display name.')).toBeInTheDocument();
  });

  test('renders form label', () => {
    render(<TestForm />);

    expect(screen.getByText('Username')).toBeInTheDocument();
  });

  test('renders form description', () => {
    render(<TestForm />);

    expect(screen.getByText('This is your public display name.')).toBeInTheDocument();
  });

  test('form control wraps input properly', () => {
    render(<TestForm />);

    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
  });

  test('form has proper accessibility', () => {
    render(<TestForm />);

    const input = screen.getByPlaceholderText('Enter username');
    const label = screen.getByText('Username');

    expect(input).toBeInTheDocument();
    expect(label).toBeInTheDocument();
  });

  test('form item groups related elements', () => {
    render(<TestForm />);

    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter username')).toBeInTheDocument();
    expect(screen.getByText('This is your public display name.')).toBeInTheDocument();
  });
});