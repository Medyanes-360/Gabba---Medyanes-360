'use client';
import classNames from 'classnames';
import React, { useEffect, useState } from 'react';
import ChevronsRight from '@/assets/icons/ChevronsRight';
import { useParams } from 'next/navigation';
import { toast } from 'react-toastify';

const NavigationButton = ({
  onClick,
  label,
  icon: Icon,
  active,
  level,
  onExpand,
  expanded,
  isChilds,
  buttonId,
  stepByStepData,
}) => {
  const handleExpand = (event) => {
    event.stopPropagation();
    onExpand?.();
  };
  const { id } = useParams();

  const [step, setStep] = useState([]);

  useEffect(() => {
    if (stepByStepData?.length > 0) {
      const data = stepByStepData.filter((data) => data.orderCode === id);
      if (data) {
        console.log(data);
        setStep(data);
      }
    }
  }, [stepByStepData]);

  // Adım renklerini belirleyen fonksiyon
  const getStepColor = (steps, buttonId) => {
    let hasPassedStep = false;
    let hasNotPassedStep = false;

    steps.forEach((data) => {
      if (data.step > buttonId) {
        hasPassedStep = true;
      } else if (data.step <= buttonId) {
        hasNotPassedStep = true;
      }
    });

    if (hasNotPassedStep && hasPassedStep) {
      return 'bg-orange-600 !text-white';
    } else if (hasPassedStep) {
      return 'bg-green-600 !text-white';
    } else {
      return 'bg-muted-foreground';
    }
  };

  return (
    <div
      key={buttonId}
      id={buttonId}
      onClick={(e) => {
        if (isChilds && !!buttonId) {
          handleExpand(e);
        } else {
          if (
            step >= buttonId ||
            buttonId == 1 ||
            buttonId == 1.1 ||
            buttonId == 1.2
          ) {
            onClick();
          } else {
            toast.warning('Lütfen ilk önceki adımı tamamlayın!');
          }
        }
      }}
      className={classNames(
        'flex items-center h-fit gap-4 rounded-lg py-3 relative px-4 text-sm font-medium',
        'cursor-pointer group',
        'transition-all duration-200 ease-in-out',
        getStepColor(step, buttonId)
      )}
    >
      {level > 1 && !active && (
        <div className='w-1.5 h-1.5 absolute left-0 rounded-full bg-muted-foreground' />
      )}
      {Icon && (
        <Icon
          className={classNames(
            !active ? 'stroke-muted-foreground' : 'stroke-muted'
          )}
        />
      )}
      {label && label !== '' && (
        <span
          className={classNames(
            'text-muted-foreground font-semibold',
            active && '!text-muted',
            step < Number(buttonId) && '!text-white',
            step > buttonId && '!text-white',
            step == buttonId && '!text-white'
          )}
        >
          {label}
        </span>
      )}

      {isChilds && !!buttonId && (
        <div
          role='button'
          className={classNames(
            'h-full transition-all duration-200 hover:bg-secondary/50 mr-1 p-1 rounded-xl ml-auto',
            expanded || active ? 'rotate-90' : ''
          )}
          onClick={handleExpand}
        >
          <ChevronsRight
            className={classNames(
              'h-4 w-4 shrink-0 !fill-white !text-white',
              expanded ? '[&>path]:fill-white' : '[&>path]:fill-white'
            )}
          />
        </div>
      )}
    </div>
  );
};

export default NavigationButton;
