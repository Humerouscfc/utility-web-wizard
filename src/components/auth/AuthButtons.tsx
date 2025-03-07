
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';

export function AuthButtons() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  if (user) {
    return (
      <Button variant="ghost" asChild>
        <Link to="/profile">Profile</Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" asChild>
        <Link to="/signin">Sign In</Link>
      </Button>
      <Button size="sm" asChild>
        <Link to="/signup">Sign Up</Link>
      </Button>
    </div>
  );
}
