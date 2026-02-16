-- content_schema の fields 内で "id" を "key" に統一するデータマイグレーション
-- 対象: タイトルが '🚃 電車遅延の連絡' の行（reason, minutes, station 等のフィールド）

update public.ze_templates
set content_schema = jsonb_build_object(
  'fields',
  (
    select jsonb_agg(
      (elem - 'id') || jsonb_build_object('key', coalesce(elem->'key', elem->'id'))
    )
    from jsonb_array_elements(content_schema->'fields') as elem
  )
)
where title = '🚃 電車遅延の連絡'
  and content_schema->'fields' is not null
  and jsonb_array_length(content_schema->'fields') > 0;
