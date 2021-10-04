import React, { useEffect, useCallback, useMemo } from 'react';
import moment from 'moment';
import { useGetQueueInfo } from 'store/asyncActions';
import { selectQueueInfo } from 'store/queueInfo';
import { useDispatch, useSelector } from 'react-redux';
import { selectTokens } from 'store/selectedQueue';
import styles from './QueueInfo.module.scss';

const DetailRow = ({ title, value, large, valueId }) => (
  <div className={styles['detail-row']}>
    <span className={styles['detail-name']}>{title}</span>
    <span
      className={`${styles['detail-value']} ${large ? styles['large-value'] : ''}`}
      data-testid={valueId}
    >
      {value}
    </span>
  </div>
);

export default ({ queueId }) => {
  const dispatch = useDispatch();
  const getQueueInfo = useCallback(useGetQueueInfo(), []);
  const tokens = useSelector(selectTokens);

  useEffect(() => {
    if (queueId) {
      dispatch(getQueueInfo({ queueId }));
    }
  }, [queueId, tokens, dispatch, getQueueInfo]);

  const {
    status,
    queueCreationTimestamp,
    numberOfActiveTokens,
    totalNumberOfTokens,
    maxQueueCapacity,
    lastRemovedTokenNumber,
  } = useSelector(selectQueueInfo);

  const availableSlots = maxQueueCapacity - numberOfActiveTokens;

  const creationTime = useMemo(() => {
    if (!queueCreationTimestamp) return '';

    const localTimeStamp = moment(queueCreationTimestamp);
    return `${localTimeStamp.format('LT')} ${localTimeStamp.format('ll')}`;
  }, [queueCreationTimestamp]);

  return (
    <div className={styles['detail']}>
      <DetailRow title="Queue status:" value={status} />
      <DetailRow title="Available Slots:" value={availableSlots} large valueId="slots-value" />
      <DetailRow title="Last called token number:" value={lastRemovedTokenNumber} />
      <DetailRow title="People currently in queue:" value={numberOfActiveTokens} large />
      <DetailRow title="Total number of people joined in queue:" value={totalNumberOfTokens} />
      <DetailRow title="Queue creation time:" value={creationTime} />
    </div>
  );
};
