import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";

// useInterval hook 实现
import { useInterval } from "@/hooks/useInterval";

export default function StockBoardStrategy() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(false);

  // 设定策略条件
  const fetchStockData = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=100&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m:0+t:6,m:0+t:13&fields=f12,f14,f3,f10,f5,f6,f8,f9"
      );
      const json = await res.json();
      const raw = json?.data?.diff || [];
      const filtered = raw
        .map((item) => ({
          code: item.f12,
          name: item.f14,
          pct: item.f3 / 100,
          turnover: parseFloat(item.f8),
          volume: item.f5,
          amount: item.f6 / 1e8,
          ratio: parseFloat(item.f9),
          close: item.f3, // 模拟股价数据
        }))
        .filter((s) => s.pct > 9.8 && s.turnover > 5 && s.amount > 1 && s.ratio > 1.5);
      setStocks(filtered);
    } catch (error) {
      console.error("Failed to fetch stock data:", error);
    }
    setLoading(false);
  };

  // 设置自动刷新功能
  useInterval(() => {
    fetchStockData();
  }, 300000); // 每5分钟自动刷新数据

  // 额外加入龙虎榜数据（示例）
  const fetchStockRanking = async (code) => {
    try {
      const res = await fetch(
        `https://push2.eastmoney.com/api/qt/clist/get?pn=1&pz=20&po=1&np=1&ut=bd1d9ddb04089700cf9c27f6f7426281&fltt=2&invt=2&fid=f3&fs=m:0+t:6,m:0+t:13&fields=f12,f14,f3,f10,f5,f6,f8,f9&stk=${code}`
      );
      const json = await res.json();
      return json?.data?.diff;
    } catch (error) {
      console.error("Failed to fetch stock ranking:", error);
    }
  };

  // 加入低吸策略条件（示例）
  const lowBuyStrategy = (stock) => {
    return stock.close < 5 && stock.pct < 0.05; // 简单的低吸策略，假设股价小于5元，且涨幅小于5%
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">A股超短打板信号筛选</h1>
      <Button onClick={fetchStockData} disabled={loading} className="mb-4">
        {loading ? "加载中..." : "刷新数据"}
      </Button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stocks.map((s) => (
          <Card key={s.code} className="shadow-lg border">
            <CardContent className="p-4">
              <h2 className="font-semibold text-lg">
                {s.name} ({s.code})
              </h2>
              <p>涨幅: {s.pct.toFixed(2)}%</p>
              <p>换手率: {s.turnover.toFixed(2)}%</p>
              <p>成交额: {s.amount.toFixed(2)}亿</p>
              <p>量比: {s.ratio.toFixed(2)}</p>
              <p>
                <Button
                  onClick={async () => {
                    const ranking = await
