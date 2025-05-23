import { Layout, Typography } from 'antd'
import { useCrypto } from '../../context/crypto-context'
import PortfolioChart from '../PortfolioChart'
import AssetsTable from '../AssetsTable'
import { useEffect, useState, useRef} from 'react'

const contentStyle = {
  textAlign: 'center',
  minHeight: 'calc(100vh - 60px)',
  color: '#fff',
  backgroundColor: '#001529',
  padding: '1rem',
}

export default function AppContent() {
  const { assets, crypto } = useCrypto()


  const cryptoPriceMap = crypto.reduce((acc, c) => {
    acc[c.id] = c.price
    return acc
  }, {})

  function AnimatedNumber({ value }) {
    const [displayValue, setDisplayValue] = useState(0)
    const animationRef = useRef()
    const startTimeRef = useRef()
    const duration = 1000 // 1.5 секунды
  
    useEffect(() => {
      const animate = (timestamp) => {
        if (!startTimeRef.current) startTimeRef.current = timestamp
        const progress = Math.min((timestamp - startTimeRef.current) / duration, 1)
        
        setDisplayValue(progress * value)
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate)
        }
      }
      
      animationRef.current = requestAnimationFrame(animate)
      
      return () => cancelAnimationFrame(animationRef.current)
    }, [value])
  
    return <span>{displayValue.toFixed(2)}</span>
  }

  return (
    <Layout.Content style={contentStyle}>

      <Typography.Title level={3} style={{ textAlign: 'left', color: '#fff' }}>
      Portfolio: $<AnimatedNumber value={assets
          .map((asset) => asset.amount * cryptoPriceMap[asset.id])
          .reduce((acc, v) => (acc += v), 0)
          } />
      </Typography.Title>
      <PortfolioChart />
      <AssetsTable />
    </Layout.Content>
  )
}
