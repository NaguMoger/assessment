import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Menu from '../components/Menu';
import { menuService } from '../services/api';

jest.mock('../services/api');

describe('Menu Component', () => {
  const mockMenuItems = [
    {
      id: '1',
      name: 'Pizza',
      description: 'Delicious pizza',
      price: 12.99,
      image_url: 'test.jpg'
    }
  ];

  test('renders menu items', async () => {
    menuService.getMenu.mockResolvedValue({ data: mockMenuItems });

    render(<Menu />);

    await waitFor(() => {
      expect(screen.getByText('Pizza')).toBeInTheDocument();
      expect(screen.getByText('$12.99')).toBeInTheDocument();
    });
  });

  test('handles loading state', () => {
    menuService.getMenu.mockImplementation(() => new Promise(() => {}));
    render(<Menu />);
    expect(screen.getByText('Loading menu...')).toBeInTheDocument();
  });

  test('handles error state', async () => {
    menuService.getMenu.mockRejectedValue(new Error('Failed to load'));
    render(<Menu />);
    await waitFor(() => {
      expect(screen.getByText('Failed to load menu')).toBeInTheDocument();
    });
  });
});