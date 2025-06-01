import * as React from 'react';
import * as RechartsPrimitive from 'recharts';

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode;
    icon?: React.ComponentType;
    color?: string;
  };
};

type ChartContextProps = {
  config: ChartConfig;
};

const ChartContext = React.createContext<ChartContextProps | null>(null);

function useChart() {
  const context = React.useContext(ChartContext);

  if (!context) {
    throw new Error('useChart must be used within a <ChartContainer />');
  }

  return context;
}

// Custom class merger function
function mergeClassNames(...args: Array<string | Record<string, boolean> | undefined | null | false>): string {
  const classes: string[] = [];

  args.forEach(arg => {
    if (!arg) return;

    if (typeof arg === 'string') {
      classes.push(arg);
    } else if (typeof arg === 'object') {
      Object.entries(arg).forEach(([key, value]) => {
        if (value) {
          classes.push(key);
        }
      });
    }
  });

  return classes.join(' ');
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    config: ChartConfig;
    children: React.ComponentProps<typeof RechartsPrimitive.ResponsiveContainer>['children'];
  }
>(({ id, className, children, config, ...props }, ref) => {
  const uniqueId = React.useId();
  const chartId = `chart-${id || uniqueId.replace(/:/g, '')}`;

  return (
    <ChartContext.Provider value={{ config }}>
      <div data-chart={chartId} ref={ref} className={mergeClassNames('chart-container', className)} {...props}>
        <style>
          {`
          .chart-container {
            display: flex;
            aspect-ratio: 16 / 9;
            justify-content: center;
            font-size: 0.75rem;
          }
          
          .chart-container .recharts-cartesian-axis-tick text {
            fill: #6c7281; /* dark muted foreground */
          }
          
          .chart-container .recharts-cartesian-grid line[stroke='#ccc'] {
            stroke: rgba(75, 85, 99, 0.5); /* dark border color */
          }
          
          .chart-container .recharts-curve.recharts-tooltip-cursor {
            stroke: #4b5563; /* dark border */
          }
          
          .chart-container .recharts-dot[stroke='#fff'] {
            stroke: transparent;
          }
          
          .chart-container .recharts-layer {
            outline: none;
          }
          
          .chart-container .recharts-polar-grid [stroke='#ccc'] {
            stroke: #4b5563; /* dark border */
          }
          
          .chart-container .recharts-radial-bar-background-sector {
            fill: #374151; /* dark muted */
          }
          
          .chart-container .recharts-rectangle.recharts-tooltip-cursor {
            fill: transparent !important;
          }
          
          .chart-container .recharts-reference-line [stroke='#ccc'] {
            stroke: #4b5563; /* dark border */
          }
          
          .chart-container .recharts-sector[stroke='#fff'] {
            stroke: transparent;
          }
          
          .chart-container .recharts-sector {
            outline: none;
          }
          
          .chart-container .recharts-surface {
            outline: none;
          }
          `}
        </style>
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>{children}</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  );
});
ChartContainer.displayName = 'Chart';

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(([_, config]) => config.color);

  if (!colorConfig.length) {
    return null;
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: `
[data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color = itemConfig.color;
    return color ? `  --color-${key}: ${color};` : null;
  })
  .filter(Boolean)
  .join('\n')}
}
`,
      }}
    />
  );
};

const ChartTooltip = RechartsPrimitive.Tooltip;

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<'div'> & {
      hideLabel?: boolean;
      hideIndicator?: boolean;
      indicator?: 'line' | 'dot' | 'dashed';
      nameKey?: string;
      labelKey?: string;
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = 'dot',
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      color,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart();

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) {
        return null;
      }

      const [item] = payload;
      const key = `${labelKey || item.dataKey || item.name || 'value'}`;
      const itemConfig = getPayloadConfigFromPayload(config, item, key);
      const value =
        !labelKey && typeof label === 'string'
          ? config[label as keyof typeof config]?.label || label
          : itemConfig?.label;

      if (labelFormatter) {
        return (
          <div className={mergeClassNames('tooltip-label-formatted', labelClassName)}>
            {labelFormatter(value, payload)}
          </div>
        );
      }

      if (!value) {
        return null;
      }

      return <div className={mergeClassNames('tooltip-label', labelClassName)}>{value}</div>;
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey]);

    if (!active || !payload?.length) {
      return null;
    }

    const nestLabel = payload.length === 1 && indicator !== 'dot';

    return (
      <div ref={ref} className={mergeClassNames('chart-tooltip', className)}>
        <style>
          {`
          .chart-tooltip {
            min-width: 8rem;
            border-radius: 0.5rem;
            border: 1px solid rgba(75, 85, 99, 0.5);
            background-color: #1f2937;
            padding: 0.375rem 0.625rem;
            font-size: 0.75rem;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
            display: grid;
            gap: 0.375rem;
            align-items: start;
          }
          
          .tooltip-label, .tooltip-label-formatted {
            font-weight: 500;
            color: #e5e7eb;
          }
          
          .tooltip-item {
            display: flex;
            width: 100%;
            flex-wrap: wrap;
            gap: 0.5rem;
          }
          
          .tooltip-item > svg {
            height: 0.625rem;
            width: 0.625rem;
            color: #9ca3af;
          }
          
          .tooltip-item-dot {
            display: flex;
            align-items: center;
          }
          
          .tooltip-indicator {
            flex-shrink: 0;
            border-radius: 2px;
          }
          
          .tooltip-indicator-dot {
            height: 0.625rem;
            width: 0.625rem;
          }
          
          .tooltip-indicator-line {
            width: 0.25rem;
          }
          
          .tooltip-indicator-dashed {
            width: 0;
            border: 1.5px dashed;
            background-color: transparent;
          }
          
          .tooltip-nested-dashed {
            margin-top: 0.125rem;
            margin-bottom: 0.125rem;
          }
          
          .tooltip-content {
            display: flex;
            flex: 1;
            justify-content: space-between;
            line-height: 1;
          }
          
          .tooltip-nested-content {
            align-items: flex-end;
          }
          
          .tooltip-normal-content {
            align-items: center;
          }
          
          .tooltip-data {
            display: grid;
            gap: 0.375rem;
          }
          
          .tooltip-name {
            color: #9ca3af;
          }
          
          .tooltip-value {
            font-family: monospace;
            font-weight: 500;
            font-variant-numeric: tabular-nums;
            color: #e5e7eb;
          }
          `}
        </style>
        {!nestLabel ? tooltipLabel : null}
        <div className="tooltip-items-container" style={{ display: 'grid', gap: '0.375rem' }}>
          {payload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || 'value'}`;
            const itemConfig = getPayloadConfigFromPayload(config, item, key);
            const indicatorColor = color || item.payload.fill || item.color;

            return (
              <div
                key={item.dataKey}
                className={mergeClassNames('tooltip-item', indicator === 'dot' && 'tooltip-item-dot')}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={mergeClassNames('tooltip-indicator', {
                            'tooltip-indicator-dot': indicator === 'dot',
                            'tooltip-indicator-line': indicator === 'line',
                            'tooltip-indicator-dashed': indicator === 'dashed',
                            'tooltip-nested-dashed': nestLabel && indicator === 'dashed',
                          })}
                          style={
                            {
                              backgroundColor: indicator !== 'dashed' ? indicatorColor : undefined,
                              borderColor: indicator === 'dashed' ? indicatorColor : undefined,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={mergeClassNames(
                        'tooltip-content',
                        nestLabel ? 'tooltip-nested-content' : 'tooltip-normal-content'
                      )}
                    >
                      <div className="tooltip-data">
                        {nestLabel ? tooltipLabel : null}
                        <span className="tooltip-name">{itemConfig?.label || item.name}</span>
                      </div>
                      {item.value && <span className="tooltip-value">{item.value.toLocaleString()}</span>}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
);
ChartTooltipContent.displayName = 'ChartTooltip';

const ChartLegend = RechartsPrimitive.Legend;

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> &
    Pick<RechartsPrimitive.LegendProps, 'payload' | 'verticalAlign'> & {
      hideIcon?: boolean;
      nameKey?: string;
    }
>(({ className, hideIcon = false, payload, verticalAlign = 'bottom', nameKey }, ref) => {
  const { config } = useChart();

  if (!payload?.length) {
    return null;
  }

  return (
    <div
      ref={ref}
      className={mergeClassNames('chart-legend', className)}
      style={{
        paddingTop: verticalAlign === 'top' ? '0' : '0.75rem',
        paddingBottom: verticalAlign === 'top' ? '0.75rem' : '0',
      }}
    >
      <style>
        {`
        .chart-legend {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
        }
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.375rem;
        }
        
        .legend-item > svg {
          height: 0.75rem;
          width: 0.75rem;
        }
        
        .legend-icon {
          height: 0.5rem;
          width: 0.5rem;
          flex-shrink: 0;
          border-radius: 2px;
        }
        `}
      </style>
      {payload.map(item => {
        const key = `${nameKey || item.dataKey || 'value'}`;
        const itemConfig = getPayloadConfigFromPayload(config, item, key);

        return (
          <div key={item.value} className="legend-item">
            {itemConfig?.icon && !hideIcon ? (
              <itemConfig.icon />
            ) : (
              <div
                className="legend-icon"
                style={{
                  backgroundColor: item.color,
                }}
              />
            )}
            {itemConfig?.label}
          </div>
        );
      })}
    </div>
  );
});
ChartLegendContent.displayName = 'ChartLegend';

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(config: ChartConfig, payload: unknown, key: string) {
  if (typeof payload !== 'object' || payload === null) {
    return undefined;
  }

  const payloadPayload =
    'payload' in payload && typeof payload.payload === 'object' && payload.payload !== null
      ? payload.payload
      : undefined;

  let configLabelKey: string = key;

  if (key in payload && typeof payload[key as keyof typeof payload] === 'string') {
    configLabelKey = payload[key as keyof typeof payload] as string;
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
    configLabelKey = payloadPayload[key as keyof typeof payloadPayload] as string;
  }

  return configLabelKey in config ? config[configLabelKey] : config[key as keyof typeof config];
}

export { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, ChartStyle };
