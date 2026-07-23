import { Box, Card, Typography } from '@mui/material';
import { format } from 'date-fns';
import type { Product } from '../../../types/products';

const formatDate = (date: string | Date) => {
  try {
    return format(new Date(date), 'dd.MM.yyyy hh:mm');
  } catch (error) {
    return '';
  }
};

interface DiscountSummaryProps {
  title?: string;
  code?: string;
  value?: string | number;
  startDate: Date | string;
  endDate?: Date | string;
  products: Pick<Product, 'title'>[];
  type: string;
}

export const DiscountSummary = ({
  title,
  value,
  startDate,
  endDate,
  products,
  type,
  code,
}: DiscountSummaryProps) => {
  const summaryFields = [
    {
      value: value,
      text: {
        post: `${type === 'amount' ? '$' : '%'} off  ${
          products.length === 1
            ? products[0].title
            : `${products.length} products`
        }`,
        pre: '',
      },
      show: !!products.length,
    },
    {
      value: startDate && formatDate(startDate),
      text: {
        pre: 'Active from',
        post: '',
      },
    },
    {
      value: endDate && formatDate(endDate),
      text: {
        pre: 'Expires on',
        post: '',
      },
    },
  ];

  return (
    <Card
      sx={{
        p: 2,
        ul: {
          pl: 2.5,
        },
        li: {
          '&:not(:last-of-type)': {
            mb: 0.5,
          },
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          mb: 2,
        }}
      >
        <Typography
          color="textPrimary"
          variant="subtitle1"
        >
          Summary
        </Typography>
      </Box>
      {[title, code, ...summaryFields.map((field) => field.value)].some(
        (item) => !!item
      ) ? (
        <>
          {(title || code) && (
            <Typography
              color="textPrimary"
              variant="subtitle1"
            >
              {title || code}
            </Typography>
          )}
          <ul>
            {summaryFields.map(
              ({ value, text, show = true }) =>
                value &&
                show && (
                  <li key={value}>
                    <Typography
                      color="textPrimary"
                      variant="body2"
                    >
                      {`${text.pre} ${value}${text.post}`}
                    </Typography>
                  </li>
                )
            )}
          </ul>
        </>
      ) : (
        <Typography
          color="textSecondary"
          variant="body2"
        >
          No information entered yet
        </Typography>
      )}
    </Card>
  );
};
