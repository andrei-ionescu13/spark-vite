import { Button } from '@/components/button';
import { InfoList } from '@/components/info-list';
import { InfoListItem } from '@/components/info-list-item';
import type { Product } from '@/types/products';
import { Card, CardContent, CardHeader, Divider } from '@mui/material';

interface ProductMetaProps {
  product: Product;
  isEditDisabled?: boolean;
  onEdit: () => void;
}

export const ProductMeta = ({
  product,
  isEditDisabled = false,
  onEdit,
}: ProductMetaProps) => {
  return (
    <Card>
      <CardHeader
        action={
          <Button
            color="secondary"
            disabled={isEditDisabled}
            onClick={onEdit}
            variant="text"
          >
            Edit
          </Button>
        }
        title="Meta"
      />
      <Divider />
      <CardContent>
        <InfoList>
          <InfoListItem
            title="Title"
            content={product.metaTitle}
          />
          <InfoListItem
            title="Description"
            content={product.metaDescription}
          />
          <InfoListItem
            title="Keywords"
            content={product.metaKeywords.join(', ')}
          />
        </InfoList>
      </CardContent>
    </Card>
  );
};
