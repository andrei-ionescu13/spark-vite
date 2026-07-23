import { Button } from '@/components/button';
import { InfoList } from '@/components/info-list';
import { InfoListItem } from '@/components/info-list-item';
import type { Product } from '@/types/products';
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Link,
} from '@mui/material';

interface ProductMediaProps {
  product: Product;
  isEditDisabled?: boolean;
  onEdit: () => void;
}

export const ProductMedia = ({
  product,
  isEditDisabled = false,
  onEdit,
}: ProductMediaProps) => {
  return (
    <Card>
      <CardHeader
        action={
          <Button
            variant="text"
            color="secondary"
            onClick={onEdit}
            disabled={isEditDisabled}
          >
            Edit
          </Button>
        }
        title="Media"
      />
      <Divider />
      <CardContent>
        <Grid
          container
          spacing={2}
        >
          <Grid size={12}>
            <InfoList>
              <InfoListItem title="Cover">
                <Box>
                  <Link
                    target="_blank"
                    href={product.cover.url}
                    sx={{ display: 'block' }}
                  >
                    <img
                      alt={product.title}
                      src={product.cover.url}
                    />
                  </Link>
                </Box>
              </InfoListItem>
              <InfoListItem title="Videos">
                <InfoList sx={{ gap: 0 }}>
                  {product.videos.map((video) => (
                    <InfoListItem
                      key={video}
                      content={video}
                      contentTypographyProps={{
                        component: Link,
                        href: video,
                        target: '_blank',
                        underline: 'hover',
                      }}
                    />
                  ))}
                </InfoList>
              </InfoListItem>
              <InfoListItem title="Images">
                <Grid
                  container
                  spacing={3}
                >
                  {product.selectedImages.map((image) => (
                    <Grid
                      key={image.public_id}
                      size={{
                        xs: 12,
                        sm: 6,
                        md: 4,
                      }}
                    >
                      <Link
                        target="_blank"
                        href={image.url}
                        sx={{ display: 'block' }}
                      >
                        <img
                          alt={image.public_id}
                          src={image.url}
                        />
                      </Link>
                    </Grid>
                  ))}
                </Grid>
              </InfoListItem>
            </InfoList>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
