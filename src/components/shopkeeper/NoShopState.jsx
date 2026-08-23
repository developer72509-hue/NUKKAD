import { Link } from 'react-router-dom';
import { Store } from 'lucide-react';
import EmptyState from '../states/EmptyState';
import Button from '../ui/Button';

export default function NoShopState() {
  return (
    <EmptyState
      icon={Store}
      title="Set up your shop"
      message="Create your shop profile to start adding products and receiving orders."
      action={
        <Button as={Link} to="/shopkeeper/register" size="sm">
          Set up shop
        </Button>
      }
    />
  );
}
