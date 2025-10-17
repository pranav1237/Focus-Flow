import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App', () => {
  it('renders core sections', () => {
    render(<App />);
    expect(screen.getByText(/Focus Flow/i)).toBeInTheDocument();
    expect(screen.getByText(/Pomodoro/i)).toBeInTheDocument();
    expect(screen.getByText(/Tasks/i)).toBeInTheDocument();
    expect(screen.getByText(/Daily Planner/i)).toBeInTheDocument();
  });
});


